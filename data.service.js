(function () {
  'use strct';

  angular
    .module('nbadraftEvaluator')
    .service('DataService', DataService)
  ;

  function DataService(WinSharesPerSeasonPerDraftPick) {
    var service = {};

    service._getAWSPSDiff = function (playerAWSPS, yourSpot) {
      var draftPickAWSPS = WinSharesPerSeasonPerDraftPick[yourSpot - 1] || 0;
      return playerAWSPS - draftPickAWSPS;
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

    service.getWeightedAWSPSDiff = function (playerAWSPS, yourSpot, actualSpot, adamWeight, benWeight) {
      var awspsDiff = service._getAWSPSDiff(playerAWSPS, yourSpot);
      var weightedPickMultiplier = service._getWeightedPickMultiplier(yourSpot, actualSpot);
      return awspsDiff * weightedPickMultiplier;
    };

    return service;
  }
})();
