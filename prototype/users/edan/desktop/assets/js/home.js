var app = angular.module("dtvModule", 
  [
    'ui.router',
    'dtv.background',
    'dtv.assetCard'
  ]
);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

    if(window.history && window.history.pushState) {
      $locationProvider.html5Mode({
        enabled: true
      });
    }

    $stateProvider
      .state('main', {
        url: '',
        resolve: {
          categoriesList: ['$dtvApi', function($dtvApi) {
            return $dtvApi.getCarousels();
          }]
        },
        views: {
          'dtvTup': {
            templateUrl: 'assets/templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      .state('main.carousel', {
        url: '/carousel/:id',
        resolve: {
          carouselItems: ['$stateParams', 'categoriesList', '$dtvApi', function($stateParams, categoriesList, $dtvApi) {
            return $dtvApi.getCarousel(categoriesList, $stateParams.id);
          }]
        },
        views: {
          'dtvTup@': {
            templateUrl: 'assets/templates/carouselGrid.html',
            controller: 'CarouselCtrl'
          }
        }        
      });
  }
]);

app.controller('AppCtrl', ['$scope', '$state', '$location',
  function($scope, $state, $location) {
    if($location.path() === '/') {
      $state.go('main');
    }

    $scope.viewSeriesDetailsModal = function (card) {
      $scope.modalActive = true;
      $scope.selectedSeries = card;
    };

  }
]);

app.controller('HomeCtrl', ['$scope', '$state', 'categoriesList',
  function($scope, $state, categoriesList) {
    $scope.categoriesList = categoriesList;

  }
]);

app.controller('CarouselCtrl', ['$scope', '$state', 'carouselItems', '$window',
  function($scope, $state, carouselItems, $window) {
    $window.scroll(0, 0);
    $scope.carouselItems = carouselItems;
  }
]);

app.service('$dtvApi', ['$http', '$q', 
  function($http, $q) {
    this.getCarousels = function() {
      var defer = $q.defer();
      $http.get('/_shared/ngtv2/data.json')
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(msg) {
          defer.reject(msg);
        });
      return defer.promise;
    };
    this.getCarousel = function(data, key) {
      for(var obj in data) {
        if(data[obj].id === parseInt(key)) {
          return data[obj].items;
        }
      }
    };
  }
]);

