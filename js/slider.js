'use strict';

(function () {
  var timeFromInput = document.querySelector('#time-from');
  var timeToInput = document.querySelector('#time-to');
  var timeSliderHandle = document.querySelector('.time-slider-handle');

  var sliderWidth = parseInt(timeFromInput.style.width, 10);

  var MIN_HOUR = 8;
  var MAX_HOUR = 17;
  var STEP_LENGTH = 15;
  var STEPS_IN_HOUR = 60 / STEP_LENGTH;
  var HOURS_IN_DAY = MAX_HOUR - MIN_HOUR;
  var STEPS_IN_DAY = STEPS_IN_HOUR * HOURS_IN_DAY;

  var HOURS_DISTANCE = 2;

  var getTimeFrom = function (currentCoord, width) {
    var currentStep = Math.floor(STEPS_IN_DAY * currentCoord / width);
    var hours = Math.floor(MIN_HOUR + currentStep / STEPS_IN_HOUR);
    var minutes = (currentStep % STEPS_IN_HOUR) * STEP_LENGTH;

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes === 0) {
      minutes = '00';
    }

    return hours + ':' + minutes;
  };

  var getTimeTo = function (timeFrom) {
    var timeArray = timeFrom.split(':');
    return parseInt(timeArray[0], 10) + HOURS_DISTANCE + ':' + timeArray[1];
  };

  var onTimeFromInputChange = function () {
    timeToInput.value = parseInt(timeFromInput.value, 10) + HOURS_DISTANCE + ':00';
  };

  var setStyleX = function (x) {
    timeSliderHandle.style.left = x + 'px';
  };

  var onSliderHandleMousedown = function (evt) {
    evt.preventDefault();
    var startCoord = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoord - moveEvt.clientX;
      startCoord = moveEvt.clientX;
      var x = timeSliderHandle.offsetLeft - shift;

      if (x < 0) {
        x = 0;
      } else if (x > sliderWidth) {
        x = sliderWidth;
      }
      setStyleX(x);

      timeFromInput.value = getTimeFrom(x, sliderWidth);
      timeToInput.value = getTimeTo(timeFromInput.value);
    };


    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var moveSlider = function (isRight) {
    var startCoord = parseFloat(timeSliderHandle.style.left);

    if (isRight) {
      var x = startCoord + sliderWidth / STEPS_IN_DAY;
      if (x > sliderWidth) {
        x = sliderWidth;
      }
    } else {
      x = startCoord - sliderWidth / STEPS_IN_DAY;
      if (x < 0) {
        x = 0;
      }
    }
    setStyleX(x);
    timeFromInput.value = getTimeFrom(x, sliderWidth);
    timeToInput.value = getTimeTo(timeFromInput.value);
  };

  var onArrowsPress = function (evt) {
    if (evt.shiftKey && evt.altKey && window.keyboard.isRightPressed(evt)) {
      moveSlider(true);
    }
    if (evt.shiftKey && evt.altKey && window.keyboard.isLeftPressed(evt)) {
      moveSlider(false);
    }
  };

  var addSliderEventListeners = function () {
    timeFromInput.addEventListener('change', onTimeFromInputChange);
    timeSliderHandle.addEventListener('mousedown', onSliderHandleMousedown);
    document.addEventListener('keydown', onArrowsPress);
  };

  var removeSliderEventListeners = function () {
    timeFromInput.removeEventListener('change', onTimeFromInputChange);
    timeSliderHandle.removeEventListener('mousedown', onSliderHandleMousedown);
    document.removeEventListener('keydown', onArrowsPress);
  };

  window.slider = {
    addSliderEventListeners: addSliderEventListeners,
    removeSliderEventListeners: removeSliderEventListeners
  };


})();
