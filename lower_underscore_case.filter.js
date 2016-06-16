(function () {
  'use strict';

  angular
    .module('nbadraftEvaluator')
    .filter('lowerUnderscoreCase', lowerUnderscoreCase)
  ;

  function lowerUnderscoreCase() {
    return function (input) {
      return input.toLowerCase().replace(/ /g, '_');
    };
  }
})();
