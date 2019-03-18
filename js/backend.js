'use strict';

(function () {
  var SAVE_URL = 'https://httpbin.org/post';
  var MAX_TIMEOUT = 10000;
  var SUCCESS_STATUS = 200;

  var save = function (onSuccess, onFailure, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onSuccess(xhr.response);
      } else {
        onFailure('Данные не отправлены. Статус ошибки: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onFailure('Произошла ошибка соединения. Данные не отправлены');
    });

    xhr.addEventListener('timeout', function () {
      onFailure('Время ожидания ответа с сервера вышло. Данные не отправлены');
    });

    xhr.timeout = MAX_TIMEOUT;
    xhr.open('POST', SAVE_URL);
    xhr.send(data);
  };


  window.backend = {
    save: save
  };


})();
