'use strict';

(function () {
  var mapFrame = document.querySelector('#mapFrame');
  var mapButtons = document.querySelectorAll('input[name="pickup-point"] + label');
  var mapRadios = document.querySelectorAll('input[name="pickup-point"]');

  var adresses = ['https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1295.4713959172564!2d60.60196258469401!3d56.90228167436167!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x43c1721281d58859%3A0x4f3fbc71515a6ebd!2z0YPQuy4g0JjQvdC00YPRgdGC0YDQuNC4LCA1NSwg0JXQutCw0YLQtdGA0LjQvdCx0YPRgNCzLCDQodCy0LXRgNC00LvQvtCy0YHQutCw0Y8g0L7QsdC7LiwgNjIwMDk4!5e0!3m2!1sru!2sru!4v1551964763402',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d647.6962040729163!2d60.59467160847741!3d56.90455879873532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x43c17213cfc35c13%3A0x14a13bd74afb2a07!2z0YPQuy4g0JvQvtC80L7QvdC-0YHQvtCy0LAsIDM4LCDQldC60LDRgtC10YDQuNC90LHRg9GA0LMsINCh0LLQtdGA0LTQu9C-0LLRgdC60LDRjyDQvtCx0LsuLCA2MjAwNDI!5e0!3m2!1sru!2sru!4v1551984225987',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1297.3839361955713!2d60.62293605967516!3d56.84712736522794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x43c16e7e333d2105%3A0x158256061312db8b!2z0YPQuy4g0JHQsNC20L7QstCwLCA0NSwg0JXQutCw0YLQtdGA0LjQvdCx0YPRgNCzLCDQodCy0LXRgNC00LvQvtCy0YHQutCw0Y8g0L7QsdC7LiwgNjIwMDc1!5e0!3m2!1sru!2sru!4v1551984528480',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1091.409621924636!2d60.57061390930074!3d56.83189028964316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x43c16ef8a184ce3d%3A0xdf927af0bf0ee96f!2z0YPQuy4g0JrRgNGL0LvQvtCy0LAsIDI3LCDQldC60LDRgtC10YDQuNC90LHRg9GA0LMsINCh0LLQtdGA0LTQu9C-0LLRgdC60LDRjyDQvtCx0LsuLCA2MjAwMjg!5e0!3m2!1sru!2sru!4v1551984578597'
  ];


  var setAddress = function (evt) {
    var i = parseInt(evt.target.htmlFor.match(/\d/), 10) - 1;
    mapFrame.src = adresses[i];
    mapRadios[i].checked = true;
  };

  var onMapButtonClick = function (evt) {
    setAddress(evt);
  };

  var onMapButtonKeydown = function (evt) {
    if (window.keyboard.isEnterPressed(evt)) {
      setAddress(evt);
    }
  };

  var addMapListeners = function () {
    mapButtons.forEach(function (button) {
      button.addEventListener('click', onMapButtonClick);
      button.addEventListener('keydown', onMapButtonKeydown);
    });
  };

  addMapListeners();

  var removeMapListeners = function () {
    mapButtons.forEach(function (button) {
      button.removeEventListener('click', onMapButtonClick);
      button.removeEventListener('keydown', onMapButtonKeydown);
    });
  };

  window.maps = {
    addMapListeners: addMapListeners,
    removeMapListeners: removeMapListeners
  };

})();
