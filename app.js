(function () {
  'use strict';

  angular
    .module('nbadraftEvaluator', ['az.helpers', 'ui.router', 'ui.bootstrap'])
    .controller('MainCtrl', MainCtrl)
  ;

  function MainCtrl(Players, DataService) {
    var vm = this;
    vm.draft = '2003';
    vm.drafts = ['2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'];
    vm.userChoices = constructUserChoices();
    vm.pointsPerDraft = constructPointsPerDraft();
    vm.players = Players;

    function constructUserChoices() {
      /*
        {
          2003: [{ name, points }, {}, ... {}],
          ...
          2015: [{}, {}, ... {}],
        }
      */

      var userChoices = {};

      vm.drafts.forEach(function (draft) {
        userChoices[draft] = [];
        for (var i = 0; i < 60; i++) {
          userChoices[draft].push({
            name: null,
            points: null,
          });
        }
      });

      return userChoices;
    }

    function constructPointsPerDraft() {
      /*
        [
          2003: null,
          ...
          2015: null,
        ]
      */

      var pointsPerDraft = {};

      vm.drafts.forEach(function (draft) {
        pointsPerDraft[draft] = null;
      });

      return pointsPerDraft;
    }

    vm.setPointsForPick = function (name, yourSpot) {
      if (!name) {
        vm.userChoices[vm.draft][yourSpot - 1].points = null;
        return;
      }

      var playerAWSPS;
      var actualSpot;

      Players[vm.draft].forEach(function (playerObj, index) {
        if (playerObj.name === name) {
          playerAWSPS = playerObj.winSharesPerSeason;
          actualSpot = index + 1;
          return;
        }
      });

      if (vm.userChoices[vm.draft] && vm.userChoices[vm.draft][yourSpot - 1]) {
        var diff = DataService.getWeightedAWSPSDiff(playerAWSPS, yourSpot, actualSpot);
        vm.userChoices[vm.draft][yourSpot - 1].points = diff;
      }
    };

    vm.setPointsForDraft = function () {
      var totalPoints = 0;
      var choicesMade = 0;

      for (var i = 0, len = vm.userChoices[vm.draft].length; i < len; i++) {
        if (vm.userChoices[vm.draft][i].points) {
          totalPoints += vm.userChoices[vm.draft][i].points;
          choicesMade++;
        }
      }

      vm.pointsPerDraft[vm.draft] = totalPoints / choicesMade;
    };

    vm.getPartialDraftActualPoints = function () {
      debugger;

      var totalPoints = 0;
      var choicesMade = 0;

      for (var i = 0, len = vm.userChoices[vm.draft].length; i < len; i++) {
        if (vm.userChoices[vm.draft][i].points) {
          totalPoints += DataService.getWeightedAWSPSDiff(Players[vm.draft][i].winSharesPerSeason, i + 1, i + 1);
          choicesMade++;
        }
      }

      return totalPoints / choicesMade;
    };

    vm.getFullDraftActualPoints = function () {
      var totalPoints = 0;

      Players[vm.draft].forEach(function (player, i) {
        totalPoints += DataService.getWeightedAWSPSDiff(player.winSharesPerSeason, i + 1, i + 1);
      });

      return totalPoints / 60;
    };
  }
})();
