var dtvModule = angular.module("dtvModule", 
  [
    'ui.router',
    'ct.ui.router.extras',
    'dtv.utils',
    'dtv.background',
    'dtv.assetCard',
    'dtv.list',
    'dtv.api',
    'dtv.env'
  ]
);

dtvModule.run(['$rootScope', '$state', '$stateParams', '$location',
  function($rootScope, $state, $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // $rootScope.$on('$stateChangeStart', function() {
    //   // Save location.search so we can add it back after transition is done
    //   this.locationSearch = $location.search();
    // });

    // $rootScope.$on('$stateChangeSuccess', function() {
    //   // Restore all query string parameters back to $location.search
    //   $location.search(this.locationSearch);
    // });
  }
]);

dtvModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$dtvEnvProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider, $dtvEnvProvider) {
    if(window.history && window.history.pushState) {
      $locationProvider.html5Mode({
        enabled: true
      });
    }

    angular.forEach($dtvEnvProvider.getStates(), function(state) {
      $stateProvider.state(state);
    });
  }
]);

dtvModule.controller('AppCtrl', ['$scope', '$location', '$state', '$stateParams', '$rootScope', '$timeout', '$dtvModal',
  function($scope, $location, $state, $stateParams, $rootScope, $timeout, $dtvModal) {
    if($location.path() === '/') {
      $state.go('app');
    }

    $scope.viewDetailsModal = function(card, carousels) {
      if(window.dragging) { return false; }
      var data = {
        card: card,
        carousels: carousels
      };

      $dtvModal.setModal({
        data: data,
        type: 'details'
      });
    };

    // $rootScope.launchVideoPlayer = function (card) {
    //   $timeout(function() {
    //     $scope.videoPlayerSideBarNav = card;
    //     $scope.dtvModal = {
    //       active: true,
    //       ngModel: {
    //         nav: $scope.videoPlayerSideBarNav
    //       },
    //       type: 'videoPlayer'
    //     };
    //   }, 1000);
    // };

    // $scope.activateModal = function (card) {
    //   $scope.videoPlayerSideBarNav = card
    //   $scope.dtvModal = {
    //     active: true,
    //     ngModel: {
    //       nav: $scope.videoPlayerSideBarNav
    //     },
    //     type: 'detailsTablet'
    //   }
    // };
  }
]);



