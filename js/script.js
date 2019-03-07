'use strict';

console.log('HEY HEY HEY');

var pickupButton = document.querySelector('#pickup-label');
var deliveryButton = document.querySelector('#delivery-label');

var pickupSection = document.querySelector('fieldset[aria-labelledby="pickup-label"]');
var deliverySection = document.querySelector('fieldset[aria-labelledby="delivery-label"]');

deliverySection.hidden = true;


deliveryButton.addEventListener('click', function() {
  deliveryButton.checked = true;
  pickupButton.checked = false;
  showElements(deliverySection);
  hideElements(pickupSection);
});

pickupButton.addEventListener('click', function() {
  pickupButton.checked = true;
  deliveryButton.checked = false;
  showElements(pickupSection);
  hideElements(deliverySection);
});



var hideElements = function (element) {
  element.hidden = true;
};

var showElements = function (element) {
  element.hidden = false;
};
