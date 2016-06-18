(function () {
  'use strct';

  angular
    .module('nbadraftEvaluator')
    .service('DataService', DataService)
  ;

  function DataService(WinSharesPerSeasonPerDraftPick) {
    var service = {};

    service._getWSPSDiff = function (playerWSPS, yourSpot) {
      var draftPickWSPS = WinSharesPerSeasonPerDraftPick[yourSpot - 1] || 0;
      return playerWSPS - draftPickWSPS;
    };

    service._getAdamPickMultiplier = function (yourSpot, actualSpot) {
      return actualSpot / yourSpot;
    };

    service._getBenPickMultiplier = function (yourSpot) {
      return Math.pow(0.95, Number(yourSpot) - 1);
    };

    service._getWeightedPickMultiplier = function (yourSpot, actualSpot, adamWeight, benWeight) {
      adamWeight = adamWeight || 0;
      benWeight = benWeight || 1;
      var adamPickMultiplier = service._getAdamPickMultiplier(yourSpot, actualSpot);
      var benPickMultiplier = service._getBenPickMultiplier(yourSpot, actualSpot);
      return (adamPickMultiplier * adamWeight) + (benPickMultiplier * benWeight);
    };

    service.getWeightedWSPSDiff = function (playerWSPS, yourSpot, actualSpot, adamWeight, benWeight) {
      var WSPSDiff = service._getWSPSDiff(playerWSPS, yourSpot);
      var weightedPickMultiplier = service._getWeightedPickMultiplier(yourSpot, actualSpot);
      return WSPSDiff * weightedPickMultiplier;
    };

    return service;
  }
})();
