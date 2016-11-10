// When using any of ui-router's services to change the state ( $state.go(), ui-sref ),
// If that state is not defined, ui-router will throw an error.
// You can catch the error this event:
//   $rootScope.$on('$stateChangeSuccess', 
//     function(e, toState, toParams, fromState, fromParams) { e.preventDefault(); // Won't log error }

// If you use $location.path() or change the url with <a href=""></a>,
// ui-router will only get called if that url has already been defined.
// If it has not been defined, then nothing happens. ui-router will not intercept that url, nor will it throw an error.

// Scenario: User tries to go to /homeview and it doesnt exist?
// Scenario: Producer controlled url's?

// If we interject our own url's that are not registered with ui-router, and a user refreshes the page
// with that url, a blank screen will show up. Maybe have multiple urls

// TRANSITION/ANIMATION MANAGER

var app = angular.module("dtvApp", ['ui.router', 'dtv.ui.router.extras']);

// http://angular-ui.github.io/ui-router/site/#/api/ui.router.router.$urlRouterProvider

app.service('$ddtv', function(){
  this.waddup = function() {
    return 'hihihihih';
  };
});

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

  // Prevent $urlRouter from automatically intercepting URL changes;
  // this allows you to configure custom behavior in between
  // location changes and route synchronization:
    // $urlRouterProvider.deferIntercept();

  // HTML5 Histroy State Management
  var pushStateSupported = (window.history && window.history.pushState);
  if (pushStateSupported) {
    $locationProvider.html5Mode({
      enabled: true
    });
  }

  $stateProvider
    .state('main', {
      url: '/',
      beforeOnEnter: function() {
        // console.log('main');
      },
      resolve: {
        hello: function() {
          return { 'mydata': 'wuegfiuwgef' };
        }
      },
      views: {
        'header': {
          // template: '<div>Header <a href="here">Green Beans</a></div>',
          // template: '<div>Header <a ng-click="wassup()">Green Beans</a></div>',
          template: '<div>Header <a href="hello">Green Beans</a></div>',
          controller: 'MainCtrl'
        },
        'content': {
          template: '<div ui-view="pop"></div>'
          // controller: 'MainCtrl'
        },
        'footer': {
          template: '<div>Footer</div>'
        },
      }
    })
    // Define a state with no URL
    .state('bro', {
      url: '/bro/:id',
      beforeOnEnter: function($ddtv, $stateParams) {
        console.log('beforeOnEnter', $stateParams);
        var state = this;
        state.views.content.template = '<div>I changed the view bro</div>';

        // state.views[id+'tab1'].template = 
        return state;
      },
      onEnter: function($ddtv) {
        console.log('BRO - onEnter', $ddtv.waddup());
      },
      views: {
        'content': {
          template: '<div> Cool view Bro</div>'
        }
      }
      
    })
    .state('main.substate', {
      url: 'hello/:id', // Inherits /main from parent state
      views: {
        'header@': {
          template: '<div>Header 2</div>',
          // controller: 'ClientListCtrl'
        },
        'pop@main': {
          template: '<div>HELLO<a ui-sref="^">home</a></div>',
          controller: 'ClientListCtrl'
        },
      }
    });

    // carousel
    // carousel/rolodex
    // carousel/grid
    // $urlRouterProvider.when(/\/carousel\/grid\/|\/carousel\/rolodex\/|\/carousel\//, 
    //   ['$state', function($state) {
    //     $state.go('bro');
    //   }]);

    $urlRouterProvider.when('/carousel/:id/',
      ['$state', function($state) {
        console.log('HELLO');
        $state.go('bro');
      }]);



    // dtv-carousels
    //   dtv-rolodex
    //     dtv-grid

    // stateFactory allows us to have custom functions that get called by futureStates
    // We define custom states inside a futureStateObject which will in turn return a ui-router state object
    // register AngularAMD ngload state factory
    // $futureStateProvider.stateFactory('ui-router', uiRouter);

    // // Alias for a regular uirouter state
    // function uiRouter($q, futureState) {
    //   console.log(futureState);
    //   var d = $q.defer();
    //   var state = {
    //     name: 'wtfman',
    //     url: '/uiwegi/iefhoiw'
    //   };
    //   d.resolve(state);
    //   return d.promise;
    // }

    //  $futureStateProvider.addResolve(function () {
    //     var fullUiRouterState = {
    //       'stateName': 'main.orange',
    //       'urlPrefix': '/orange',
    //       views: {
    //         'content': {
    //           template: '<h1>orange</hi>'
    //         }
    //       }
    //     };
    //     return fullUiRouterState;
    //  });
}]);

app.controller('AppCtrl', ['$state', '$location', '$rootScope', '$ddtv', function($state, $location, $rootScope, $ddtv) {
  if($location.path() === '/') {
    $state.go('main');
  }

  // $rootScope.$on('$stateNotFound', 
  // function(event, unfoundState, fromState, fromParams) {
  //   // event.preve
  //   console.log('$stateNotFound');

  //   event.preventDefault();

  // });

  // $rootScope.$on('$stateChangeSuccess', 
  // function(event, toState, toParams, fromState, fromParams) { 
  //   // event.preve
  //   console.log('$stateChangeSuccess', toState, fromState);

  // });

  // $rootScope.$on('$stateChangeError', 
  // function(event, toState, toParams, fromState, fromParams, error){ 
  //   console.log('$stateChangeError');
  // });
}]);

app.controller('MainCtrl', ['$scope', '$location', function($scope, $location) {
  console.log('MainCtrl');

  $scope.wassup = function() {
    $location.path('/peopef');
  };
}]);

app.controller('ClientListCtrl', ['$state', '$location', function($state, $location) {
  console.log('ClientListCtrl');
}]);
















