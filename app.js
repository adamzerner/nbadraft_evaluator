(function () {
  'use strict';

  angular
    .module('nbadraftEvaluator', ['az.helpers', 'ui.router', 'ui.bootstrap'])
    .controller('MainCtrl', MainCtrl)
  ;

  function MainCtrl(YearlyPlayersDictionary, $filter, $http) {
    var vm = this;
    vm.year = '2003';
    vm.availableYears = ['2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'];
    vm.userChoices = {
      2003: new Array(60),
      2004: new Array(60),
      2005: new Array(60),
      2006: new Array(60),
      2007: new Array(60),
      2008: new Array(60),
      2009: new Array(60),
      2010: new Array(60),
      2011: new Array(60),
      2012: new Array(60),
      2013: new Array(60),
      2014: new Array(60),
      2015: new Array(60),
    };
    vm.yearlyPlayersDictionary = YearlyPlayersDictionary;
  }
})();
