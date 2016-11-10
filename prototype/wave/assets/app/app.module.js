var ngtvApp = angular.module('ngtvApp',
  [
    'ngAnimate',
    'ngtvApp.desktop',
    'ngtvApp.mobile',
    'ct.ui.router.extras',
    'dtv.api',
    'dtv.assetCard',
    'dtv.intentPicker',
    'dtv.startWatching',
    'dtv.list',
    'dtv.stackView',
    'dtv.background',
    'dtv.utils'
  ]
);

ngtvApp.run(['$rootScope', '$state', function($rootScope, $state, $location){
  'use strict';
  // Expose $state to scope for convenience
  $rootScope.$state = $state;
  // Expose $location to scope for convenience
  $rootScope.$location = $location;
}]);


ngtvApp.run( function ($rootScope, $location, $state) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    // Handling details modal deep-linking
    // TO-DO: default state is hard-coded to entertainment carousel view for now.
    // TO-DO: default state should be dynamic based on program type or something
    if(toState.name == 'modal.details' && !fromState.name){
      event.preventDefault();
      $state.go('app.entertainment.carousel').then(function(){
        $state.go(toState.name, toParams);
      })
    }

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
  $scope.platform = $env.platform;
  $state.go('app');
});