(function () {
  'use strict';

  angular
    .module('nbadraftEvaluator', ['az.helpers', 'ui.router', 'ui.bootstrap'])
    .controller('MainCtrl', MainCtrl)
  ;

  function MainCtrl(Players, DataService, WinSharesPerSeasonPerDraftPick) {
    var vm = this;
    vm.draft = '2003';
    vm.drafts = ['2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'];
    vm.userChoices = constructUserChoices();
    vm.pointsPerDraft = constructPointsPerDraft();
    vm.players = Players;
    vm.WinSharesPerSeasonPerDraftPick = WinSharesPerSeasonPerDraftPick;

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
            winSharesPerSeason: null,
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
    vm.getPickMultiplyer = function (pick) {
      return DataService._getBenPickMultiplier(pick);
    };

    vm.onSelect = function (name, pick) {
      vm.setPointsForPick(name, pick);
      vm.setWSPSForPick(name, pick);
      vm.setPointsForDraft();
    };

    vm.getPointsForPick = function (name, yourSpot) {
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
        return DataService.getWeightedAWSPSDiff(playerAWSPS, yourSpot, actualSpot);
      }
    };

    vm.setPointsForPick = function (name, yourSpot) {
      var diff = vm.getPointsForPick(name, yourSpot);
      vm.userChoices[vm.draft][yourSpot - 1].points = diff;
    };

    vm.setWSPSForPick = function (name, pick) {
      if (!name) {
        vm.userChoices[vm.draft][pick - 1].winSharesPerSeason = null;
        return;
      }

      var playerAWSPS;

      Players[vm.draft].forEach(function (playerObj, index) {
        if (playerObj.name === name) {
          playerAWSPS = playerObj.winSharesPerSeason;
          return;
        }
      });

      if (vm.userChoices[vm.draft] && vm.userChoices[vm.draft][pick - 1]) {
        vm.userChoices[vm.draft][pick - 1].winSharesPerSeason = playerAWSPS;
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

      if (choicesMade) {
        vm.pointsPerDraft[vm.draft] = totalPoints / choicesMade;
      } else {
        vm.pointsPerDraft[vm.draft] = '';
      }
    };

    vm.getPartialDraftActualPoints = function () {
      var totalPoints = 0;
      var choicesMade = 0;

      for (var i = 0, len = vm.userChoices[vm.draft].length; i < len; i++) {
        if (vm.userChoices[vm.draft][i].points) {
          totalPoints += DataService.getWeightedAWSPSDiff(Players[vm.draft][i].winSharesPerSeason, i + 1, i + 1);
          choicesMade++;
        }
      }

      if (choicesMade) {
        return totalPoints / choicesMade;
      }
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
