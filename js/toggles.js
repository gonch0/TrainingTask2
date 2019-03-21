'use strict';

(function () {

  var pickupButton = document.querySelector('#pickup-label');
  var deliveryButton = document.querySelector('#delivery-label');
  var pickupRadio = document.querySelector('#delivery-1');
  var deliveryRadio = document.querySelector('#delivery-2');

  var pickupSection = document.querySelector('fieldset[aria-labelledby="pickup-label"]');
  var deliverySection = document.querySelector('fieldset[aria-labelledby="delivery-label"]');

  var phonePickupDescription = document.querySelector('.phone-description-pickup');
  var phoneDeliveryDescription = document.querySelector('.phone-description-delivery');

  var cardButton = document.querySelector('label[for="payment-card"]');
  var cashButton = document.querySelector('label[for="payment-cash"]');
  var cardRadio = document.querySelector('#payment-card');
  var cashRadio = document.querySelector('#payment-cash');
  var cardSection = document.querySelector('.card');

  var form = document.querySelector('.orderForm');
  var submitButton = document.querySelector('.submit button');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var submitText = document.querySelector('.submit p');

  var resetableInputs = document.querySelectorAll('input:not([type="radio"]):not([readonly])');

  var orderRadiogroup = document.querySelector('.order-radiogroup');
  var paymentRadiogroup = document.querySelector('.payment-radiogroup');

  var showDeliverySection = function () {
    showElements([deliverySection, phoneDeliveryDescription]);
    hideElements([pickupSection, phonePickupDescription]);

    window.maps.removeMapListeners();
    window.validations.checkInputs();
    window.validations.addDeliveryEventListeners();
    window.slider.addSliderEventListeners();

    cashButton.addEventListener('click', onCashButtonClick);
    cashButton.addEventListener('keydown', onCashButtonKeydown);

  };

  var removeDeliveryButtonListeners = function () {
    deliveryButton.removeEventListener('click', onDeliveryButtonClick);
    deliveryButton.removeEventListener('keydown', onDeliveryButtonKeydown);
    pickupButton.addEventListener('click', onPickupButtonClick);
    pickupButton.addEventListener('keydown', onPickupButtonKeydown);
  };

  var onDeliveryButtonClick = function () {
    showDeliverySection();
    removeDeliveryButtonListeners();
    window.validations.checkInputs();
  };

  var onDeliveryButtonKeydown = function (evt) {
    if (window.keyboard.isEnterPressed(evt)) {
      showDeliverySection();
      deliveryRadio.checked = true;
      removeDeliveryButtonListeners();
    }
  };

  deliveryButton.addEventListener('click', onDeliveryButtonClick);
  deliveryButton.addEventListener('keydown', onDeliveryButtonKeydown);

  var showElements = function (elements) {
    elements.forEach(function (element) {
      element.hidden = false;
      element.disabled = false;
    });
  };

  var hideElements = function (elements) {
    elements.forEach(function (element) {
      element.hidden = true;
      element.disabled = true;
    });
  };


  var showPickupSection = function () {
    showElements([pickupSection, phonePickupDescription]);
    hideElements([deliverySection, phoneDeliveryDescription]);

    window.maps.addMapListeners();
    window.validations.checkInputs();
    window.validations.removeDeliveryEventListeners();
    window.slider.removeSliderEventListeners();

  };

  var removePickupButtonListeners = function () {
    pickupButton.removeEventListener('click', onPickupButtonClick);
    pickupButton.removeEventListener('keydown', onPickupButtonKeydown);
    deliveryButton.addEventListener('click', onDeliveryButtonClick);
    deliveryButton.addEventListener('keydown', onDeliveryButtonKeydown);
    cashButton.removeEventListener('click', onCashButtonClick);
    cashButton.removeEventListener('keydown', onCashButtonKeydown);
    cardButton.removeEventListener('click', onCardButtonClick);
    cardButton.removeEventListener('keydown', onCardButtonKeydown);
  };

  var onPickupButtonClick = function () {
    showPickupSection();
    removePickupButtonListeners();
  };

  var onPickupButtonKeydown = function (evt) {
    if (window.keyboard.isEnterPressed(evt)) {
      showPickupSection();
      pickupRadio.checked = true;
      removePickupButtonListeners();
    }
  };

  var toggleCardSection = function () {
    if (cardSection.hidden) {
      showElements([cardSection]);
    } else {
      hideElements([cardSection]);
    }
    window.validations.checkInputs();
  };


  /*var onPaymentRadiogroupChange = function () {
    toggleCardSection();
    window.validations.addCardEventListeners();
    toggleCardButtonListeners();
  };

  paymentRadiogroup.addEventListener('change', onPaymentRadiogroupChange);*/

  var onCardButtonClick = function () {
    toggleCardSection();
    window.validations.addCardEventListeners();
    toggleCardButtonListeners();
  };

  var onCashButtonClick = function () {
    toggleCardSection();
    window.validations.removeCardEventListeners();
    toggleCashButtonListeners();
  };

  var onCardButtonKeydown = function (evt) {
    if (window.keyboard.isEnterPressed(evt)) {
      toggleCardSection();
      window.validations.addCardEventListeners();
      toggleCardButtonListeners();
      cardRadio.checked = true;
    }
  };

  var onCashButtonKeydown = function (evt) {
    if (window.keyboard.isEnterPressed(evt)) {
      toggleCardSection();
      window.validations.removeCardEventListeners();
      toggleCashButtonListeners();
      cashRadio.checked = true;
    }
  };

  var toggleCashButtonListeners = function () {
    cashButton.removeEventListener('click', onCashButtonClick);
    cashButton.removeEventListener('keydown', onCashButtonKeydown);
    cardButton.addEventListener('click', onCardButtonClick);
    cardButton.addEventListener('keydown', onCardButtonKeydown);
  };

  var toggleCardButtonListeners = function () {
    cardButton.removeEventListener('click', onCardButtonClick);
    cardButton.removeEventListener('keydown', onCardButtonKeydown);
    cashButton.addEventListener('click', onCashButtonClick);
    cashButton.addEventListener('keydown', onCashButtonKeydown);
  };

paymentRadiogroup
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    // Сериализация данных с помощью jQuery
    /* eslint-disable*/
    var $orderForm = $('.orderForm');
    var serializedData = $orderForm.serializeArray();
    var preparedData = {};

    $.map(serializedData, function (el) {
      preparedData[el['name']] = el['value'];
    });
    /* eslint-enable */
    var data = JSON.stringify(preparedData);
    window.backend.save(onLoad, onError, data);
  });


  var onLoad = function () {
    var successElement = successTemplate.cloneNode(true);
    var onSuccessClose = function () {
      successElement.remove();
    };

    document.addEventListener('click', onSuccessClose);
    document.body.insertAdjacentElement('afterbegin', successElement);
    form.reset();
    window.slider.setStyleX(0);
    onPickupButtonClick();
    onCardButtonClick();
    submitButton.disabled = true;
    cardSection.hidden = false;
    cardSection.disabled = false;
    resetableInputs.forEach(function (input) {
      window.validations.checkInputValidity(input, false);
    });
  };

  var onError = function (message) {
    submitText.hidden = false;
    submitText.textContent = message;
    if (!message) {
      submitText.textContent = 'Произошла ошибка';
    }
  };

})();
