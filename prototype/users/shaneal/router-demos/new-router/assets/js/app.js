angular.module('app', ['ngNewRouter', 'app.home'])
  .config(['$locationProvider', function($locationProvider) {
    var pushStateSupported = (window.history && window.history.pushState);
    if (pushStateSupported) {
      $locationProvider.html5Mode({
        enabled: true
      });
    }
  }])
  .controller('AppController', ['$router', AppController]);

AppController.$routeConfig = [
  {
    path: '/',
    components: {
      'main': 'home'
    }
  }
];

function AppController($router) {

}