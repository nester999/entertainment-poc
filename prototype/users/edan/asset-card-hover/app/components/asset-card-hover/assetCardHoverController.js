'use strict';

(function() {
  var app = angular.module("NgtvPhase2", ['ngSanitize', 'dtv.assetCard', 'dtv.background']);

  app.controller("AssetCardHoverController", ['$scope', '$rootScope', '$filter', '$interval', '$http', '$timeout', function($scope, $rootScope, $filter, $interval, $http, $timeout) {
    $scope.card = {
      "id": 177572,
      "poster_path": "https://image.tmdb.org/t/p/w300/9gm3lL8JMTTmc3W4BmNMCuRLdL8.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w500/2BXd0t9JdVqCp9sKf6kzMkr7QjB.jpg",
      "card_type": "recomendation", // 'recomendation, following, in-progress'
      "media_type": "movie", // 'movie', 'show', 'episode', 'clip', 'music-video', 'sporting-event', 'actor-personality', 'network', 'live-content'
      "title": "Guardiaffffns of the Galaxy",
      "hash_tag": "paulrudd",
      "tomato_score": 96,
      "recomended_by": "The Avengers",
      "description": "Larger-than-life and dangerously explosive, they're so funny that boys and girls will love the film in equal measure.",
      "media_duration": "3720000",
      "media_position": "1860000",
      'ppv': true,
      "subscribed": true
    };


  }]);

})();
