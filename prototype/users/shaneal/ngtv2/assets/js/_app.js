// Application wide dependencies that loads when page loads

var app = angular.module("dtvApp",
  ['ui.router', 'ct.ui.router.extras.future', 'ui.bootstrap', 'oc.lazyLoad']);

app.config(['$futureStateProvider', '$stateProvider', '$locationProvider',
  function($futureStateProvider, $stateProvider, $locationProvider) {
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
  // $futureStateProvider.stateFactory('ngload', ngloadStateFactory);
  $futureStateProvider.stateFactory('lazyload', lazyload);
  $futureStateProvider.stateFactory('ui-router', uiRouter);

  // Loading states from .json file during runtime
  $futureStateProvider.addResolve(loadAndRegisterFutureStates);
  function loadAndRegisterFutureStates($http) {
    // $http.get().then() returns a promise
    return $http.get('/json/initial-states').then(function(resp) {
      angular.forEach(resp.data, function (fstate) {
        // Register each state returned from $http.get() with $futureStateProvider
        $futureStateProvider.futureState(fstate);
      });
    });
  }
}]);

var lazyload = function($q, $ocLazyLoad, futureState) {
  var d = $q.defer();
  $ocLazyLoad.load(futureState.dependencies).then(function() {
     d.resolve();
  }, function() {
     d.reject();
  });
  return d.promise;
};

// Alias for a regular uirouter state
var uiRouter = function($q, $ocLazyLoad, futureState) {
  var d = $q.defer();
  var state = {
    name: futureState.stateName,
    url: futureState.urlPrefix,
    views: futureState.views,
  };
  if(futureState.dependencies) {
    $ocLazyLoad.load(futureState.dependencies).then(function() {
      d.resolve(state);
    }, function() {
      d.resolve();
    });    
  }
  return d.promise;
};