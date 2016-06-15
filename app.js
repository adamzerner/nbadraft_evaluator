(function () {
  'use strict';

  angular
    .module('nbadraftEvaluator', ['az.helpers', 'ui.router', 'ui.bootstrap'])
    .controller('MainCtrl', MainCtrl)
  ;

  function MainCtrl(YearlyPlayersDictionary) {
    var vm = this;
    vm.year = '2007';
    vm.availableYears = ['2007', '2008', '2009'];
    vm.userChoices = new Array(60);
    vm.yearlyPlayersDictionary = YearlyPlayersDictionary;
  }
})();
