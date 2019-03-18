'use strict';

(function () {
  var phoneInput = document.querySelector('#phone');

  var dateInput = document.querySelector('#date');
  var today = new Date();
  var addressInput = document.querySelector('#address');

  var tooltips = document.querySelectorAll('.tooltip');

  var submitButton = document.querySelector('.submit button');
  var submitText = document.querySelector('.submit p');
  var focusableDeliveryInputs = document.querySelectorAll('input:not([type="radio"]):not([readonly]):not(#credit-card):not(#phone)');

  var cardInputs = Array.from(document.querySelectorAll('.card-section'));
  var cardMainInput = document.querySelector('input[name="credit-card"]');
  var cardField = document.querySelector('.card');
  var CARD_INPUT_LENGTH = 4;
  var CARD_NUMBER_LENGTH = 16;
  var MAX_DAYS = 7 * 24 * 3600 * 1000;
  var index;

  var addPrefix = function (p) {
    return (p < 10 ? '0' : '') + p;
  };

  var setDateValue = function (input, element) {
    input.value = addPrefix(element.getDate()) + '/' + addPrefix(element.getMonth() + 1) + '/' + element.getFullYear();
  };

  setDateValue(dateInput, today);

  // Маска для ввода даты с помощью jQuery.maskedinput
  /* eslint-disable */
  $('#date').mask('99/99/9999', {autoclear: false});
  /* eslint-enable */

  var checkInputValidity = function (input, condition) {
    input.classList.add('invalid');
    if (input.value && condition) {
      input.classList.remove('invalid');
    }
  };

  var checkDate = function (dateContent) {
    var inputtedContent = dateContent.split('/');
    var inputtedDate = new Date(inputtedContent[2], inputtedContent[1] - 1, inputtedContent[0]);
    var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var outDateCondition = +inputtedDate < +todayDate || +inputtedDate - +todayDate > MAX_DAYS;

    checkInputValidity(dateInput, !outDateCondition);

  };

  var onDateInputBlur = function () {
    var dateInputContent = dateInput.value;

    if (!dateInputContent.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)) {
      setDateValue(dateInput, today);
    }

    checkDate(dateInputContent);
    showTooltip();
    checkInputs();
  };

  var checkCardNumber = function (number) {

    if (number.length !== CARD_NUMBER_LENGTH) {
      return false;
    }
    // Алгоритм Луна:
    var sum = 0;
    var numberArray = number.split('').map(Number);
    numberArray.forEach(function (digit, i) {
      if ((numberArray.length - i) % 2 === 0) {
        digit = digit * 2;

        if (digit > 9) {
          digit = digit - 9;
        }
      }
      sum += digit;
    });
    return sum % 10 === 0;
  };


  var onCardFieldChange = function () {
    var cardNumber = '';

    cardInputs.forEach(function (input) {
      if (input.value.length === CARD_INPUT_LENGTH) {
        cardNumber += input.value;
      }
    });

    cardMainInput.value = cardNumber;
    checkInputValidity(cardMainInput, checkCardNumber(cardNumber));

    cardInputs.forEach(function (element) {
      checkInputValidity(element, checkCardNumber(cardNumber));
    });
  };

  var showTooltip = function () {
    var invalidInputs = document.querySelectorAll('.invalid:not(:disabled)');
    if (invalidInputs[0]) {
      var invalidInputLabel = invalidInputs[0].attributes['aria-labelledby'].value;
      var tooltip = document.querySelector('#' + invalidInputLabel);
      tooltip.hidden = false;
    }
  };

  var hideTooltips = function () {
    tooltips.forEach(function (tip) {
      tip.hidden = true;
    });
  };


  var setSubmitText = function (inputs) {
    submitText.hidden = false;
    submitText.textContent = 'Осталось заполнить: \r\n';

    inputs.forEach(function (item, i) {
      var invalidLabel = document.createElement('label');
      invalidLabel.htmlFor = item.name;

      invalidLabel.textContent = item.previousElementSibling.textContent;
      if (i !== inputs.length - 1) {
        invalidLabel.textContent += ';  ';
      }
      submitText.appendChild(invalidLabel);
    });
  };

  var checkInputs = function () {
    var invalidInputs = document.querySelectorAll('input:not([type="radio"]):not(:disabled):not(.card-section).invalid');
    submitButton.disabled = false;
    submitText.hidden = true;

    if (invalidInputs[0]) {
      submitButton.disabled = true;
      setSubmitText(invalidInputs);
    }
  };

  checkInputs();

  phoneInput.addEventListener('blur', function () {
    checkInputValidity(phoneInput, true);
    showTooltip();
    checkInputs();
  });

  phoneInput.addEventListener('focus', function () {
    hideTooltips();
  });

  var onInputFocus = function () {
    hideTooltips();
  };

  var onAddressInputBlur = function () {
    checkInputValidity(addressInput, true);
    showTooltip();
    checkInputs();
  };

  var onCardInputBlur = function () {
    showTooltip();
    checkInputs();
  };

  var onCardInputKeydown = function (evt) {
    index = parseInt(evt.target.id.match(/\d/), 10) - 1;
    if (cardInputs[index].value.length === 0 && window.keyboard.isBackspacePressed(evt) || window.keyboard.isDeletePressed(evt)) {
      cardInputs[index - 1].value.slice(-1);
      cardInputs[index - 1].focus();
    }
  };

  var onCardInputKeyup = function (evt) {
    index = parseInt(evt.target.id.match(/\d/), 10) - 1;
    if (cardInputs[index].value.length === 4) {
      cardInputs[index + 1].focus();
    }
  };


  var addDeliveryEventListeners = function () {
    focusableDeliveryInputs.forEach(function (input) {
      input.addEventListener('focus', onInputFocus);
    });
    addressInput.addEventListener('blur', onAddressInputBlur);
    dateInput.addEventListener('blur', onDateInputBlur);
    cardField.addEventListener('change', onCardFieldChange);

    addCardEventListeners();
  };

  var addCardEventListeners = function () {
    cardField.addEventListener('change', onCardFieldChange);

    cardInputs.forEach(function (input, i) {
      input.addEventListener('focus', onInputFocus);
      input.addEventListener('blur', onCardInputBlur);

      if (i > 0) {
        input.addEventListener('keydown', onCardInputKeydown);
      }

      if (i < cardInputs.length - 1) {
        input.addEventListener('keyup', onCardInputKeyup);
      }
    });
  };

  var removeDeliveryEventListeners = function () {
    focusableDeliveryInputs.forEach(function (input) {
      input.removeEventListener('focus', onInputFocus);
    });

    addressInput.removeEventListener('blur', onAddressInputBlur);
    dateInput.removeEventListener('blur', onDateInputBlur);

    removeCardEventListeners();
  };

  var removeCardEventListeners = function () {
    cardField.removeEventListener('change', onCardFieldChange);
    cardInputs.forEach(function (input) {
      input.removeEventListener('blur', onCardInputBlur);
      input.removeEventListener('keydown', onCardInputKeydown);
      input.removeEventListener('keyup', onCardInputKeyup);
      input.removeEventListener('focus', onInputFocus);
    });

  };

  window.validations = {
    checkInputs: checkInputs,
    checkInputValidity: checkInputValidity,
    addDeliveryEventListeners: addDeliveryEventListeners,
    addCardEventListeners: addCardEventListeners,
    removeDeliveryEventListeners: removeDeliveryEventListeners,
    removeCardEventListeners: removeCardEventListeners
  };

})();
