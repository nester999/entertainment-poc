// Application wide dependencies that loads when page loads
define([ 'angularAMD', 'jquery', 'angular-ui-router',
         'ui-router-extras-future', 'angular-bootstrap',
         'NavCtrl'
        ],
function (angularAMD) { // Only need to inject angularAMD for app config
  var app = angular.module("dtvApp",
    [ 'ct.ui.router.extras.future', 'ui.bootstrap', 'ui.router', 'dtvNav' ]);

  app.config(['$futureStateProvider', '$controllerProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($futureStateProvider, $controllerProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

    // HTML5 Histroy State Management
    var pushStateSupported = (window.history && window.history.pushState);
    if (pushStateSupported) {
      $locationProvider.html5Mode({
        enabled: true
      });
    }

    // stateFactory allows us to have custom functions that get called by futureStates
    // We define custom states inside a futureStateObject which will in turn return a ui-router state object
    // register AngularAMD ngload state factory
    $futureStateProvider.stateFactory('ngload', ngloadStateFactory);
    $futureStateProvider.stateFactory('ui-router', uiRouter);

    // Loading states from .json file during runtime
    $futureStateProvider.addResolve(loadAndRegisterFutureStates);
    function loadAndRegisterFutureStates($http) {
      // $http.get().then() returns a promise
      return $http.get('assets/js/states.json').then(function (resp) {
        angular.forEach(resp.data, function (fstate) {
          // Register each state returned from $http.get() with $futureStateProvider
          $futureStateProvider.futureState(fstate);
        });
      });
    }
  }]);

  // Tell angularAMD to tell angular to bootstrap our app
  angularAMD.bootstrap(app);
  // return app for requireJS registration
  return app;

  // Load module and new states
  function ngloadStateFactory($q, futureState) {
    var ngloadDeferred = $q.defer();
    require(['ngload!' + futureState.src , 'ngload', 'angularAMD'],
      function ngloadCallback(result, ngload, angularAMD) {
        angularAMD.processQueue();
        ngloadDeferred.resolve(undefined);
      });
    return ngloadDeferred.promise;
  }

  // Alias for a regular uirouter state
  function uiRouter($q, futureState) {
    var d = $q.defer();
    var state = {
      name: futureState.stateName,
      url: futureState.urlPrefix,
      views: futureState.views
    };
    d.resolve(state);
    return d.promise;
  }
});