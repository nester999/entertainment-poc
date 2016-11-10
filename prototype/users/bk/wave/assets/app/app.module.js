var ngtvApp = angular.module('ngtvApp',['ngtvApp.desktop','ct.ui.router.extras']);

ngtvApp.run(['$rootScope', '$state', function($rootScope, $state, $location){
  'use strict';
  // Expose $state to scope for convenience
  $rootScope.$state = $state;
  // Expose $location to scope for convenience
  $rootScope.$location = $location;
}]);


ngtvApp.run( function ($rootScope, $location) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //save location.search so we can add it back after transition is done
    this.locationSearch = $location.search();
  });

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    //restore all query string parameters back to $location.search
    $location.search(this.locationSearch);
  });
});

ngtvApp.config(['$locationProvider', function($locationProvider){
  'use strict';
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);

ngtvApp.controller('AppCtrl', function($scope, $state){
  $scope.browser = 'desktop';
  $state.go('app');
});