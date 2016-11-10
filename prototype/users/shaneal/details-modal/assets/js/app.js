(function(angular, FastClick) {
'use strict';

var app = angular.module('dtvApp', 
  [
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'dtv.api',
    'dtv.scroll',
    'dtv.detailsCarousel',
    'dtv.programDetails',
    'dtv.assetCard',
    'dtv.background'
  ]
);

app.run(['$rootScope', '$state', function($rootScope, $state) {
  FastClick.attach(document.body);
  $rootScope.$state = $state;
}]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

  // HTML5 Histroy State Management
  var pushStateSupported = (window.history && window.history.pushState);
  if (pushStateSupported) {
    $locationProvider.html5Mode(true);
  }

  $stateProvider
    .state('modal', {
      url: '',
      controller: ['$scope', 'carouselData', function($scope, carouselData) {
        $scope.carouselData = carouselData;
      }],
      resolve: {
        carouselData: ['$dtvApi', function($dtvApi) {
          return $dtvApi.getCarousels();
        }]
      },
      templateUrl: 'assets/templates/home.html'
    })
    .state('modal.episodes', {
      url: '/all-episodes/:id',
      resolve: {
        episodeData: ['$dtvApi', '$stateParams', function($dtvApi, $stateParams) {
          return $dtvApi.getEpisodes($stateParams.id);
        }]
      },
      controller: ['$scope', 'episodeData', function($scope, episodeData) {
        $scope.episodeData = episodeData;
      }],
      templateUrl: 'assets/templates/all-episodes.html'
    })
    .state('modal.clips', {
      url: '/clips/:id',
      resolve: {
        clipData: ['$dtvApi', function($dtvApi) {
          return $dtvApi.getClips();
        }]
      },
      controller: ['$scope', 'clipData', function($scope, clipData) {
        console.log(clipData);
        $scope.clipData = clipData;
      }],
      templateUrl: 'assets/templates/clips.html'
    });

  $urlRouterProvider.otherwise('/');
}]);

app.controller('AppCtrl', ['$state', function($state) {
  $state.go('modal');
}]);

})(window.angular, window.FastClick);

// "id": 266856,
// "title": "The Theory of Everything",
// "poster_path": "https://image.tmdb.org/t/p/w500/4jspr8hLLuju59bCnMiefzRW4p0.jpg",
// "backdrop_path": "https://image.tmdb.org/t/p/original/jIh6T8re0iFYEqBXlBMkAUhLgpr.jpg",
// "media_type": "movie",
// "release_date": "2014",
// "tomato_score": 96,
// "flickster_score": 95,
// "description": "A look at the relationship between the famous physicist Stephen Hawking and his wife.",
// "genres": ["Biography, "Drama", "Thriller"],
// "rating": "PG-13"



// angular.module('app', [])
// .directive('dtvRepeat', function() {
//   return function(scope, element, attrs) {
//     if (scope.$last) {
//       window.alert("im the last!");
//     }
//   };
// });

// $dtvBackdrop
//   getCurrentItem;
//   addItem
//   loadImage
//   transitionTo(fi, ti, val)