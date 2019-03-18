'use strict';
(function () {

  var Keycode = {
    ESC: 27,
    ENTER: 13,
    LEFT: 37,
    RIGHT: 39,
    BACKSPACE: 8,
    DELETE: 46
  };

  window.keyboard = {
    isEnterPressed: function (evt) {
      return evt.keyCode === Keycode.ENTER;
    },
    isEscPressed: function (evt) {
      return evt.keyCode === Keycode.ESC;
    },
    isRightPressed: function (evt) {
      return evt.keyCode === Keycode.RIGHT;
    },
    isLeftPressed: function (evt) {
      return evt.keyCode === Keycode.LEFT;
    },

    isBackspacePressed: function (evt) {
      return evt.keyCode === Keycode.BACKSPACE;
    },

    isDeletePressed: function (evt) {
      return evt.keyCode === Keycode.DELETE;
    }
  };
})();
