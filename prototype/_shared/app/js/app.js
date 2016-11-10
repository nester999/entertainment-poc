$(function() {
  FastClick.attach(document.body);
});

(function(dtvClientData, angular) {
  'use strict';

  var app = angular.module('dtvPoc', ['ui.router', 'ngAnimate']);

  app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
    var pushStateSupported = (window.history && window.history.pushState);
    if (pushStateSupported) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'template.html'
      });

    if(dtvClientData.states) {
      for(var routeName in dtvClientData.states) {
        $stateProvider.state(routeName, dtvClientData.states[routeName]);
      }
    }
  });

  app.controller('AppCtrl', function($scope, $location, $rootScope, $window) {
    $rootScope.$on('$stateChangeSuccess', 
      function() {
        var url = $location.url();
        if(url === '/') {
          $scope.items = angular.copy(dtvClientData.files);
        } else {
          $scope.items = walk(dtvClientData.files, url);
        }
      });

    $scope.handleClick = function(item) {
      console.log(item);
      if(item.type === 'prototype' || item.type === 'file') {
        $window.location = item.url;
      } else {
        $location.path(item.url);
      }
    };

    $scope.selectChanged = function(page) {
      $window.location = page.replace('.jade', '').replace('.ejs', '').replace('.html', '');
    };

    function walk(obj, url) {
      var _children = [];
      function _walk(obj, url) {
        for(var k in obj) {
          if(typeof obj[k] === 'object' && obj[k] !== null) {
            if(obj[k].url === url) {
              _children = obj[k].children;
              return;
            }
            _walk(obj[k], url);
          }
        }
        if(_children.length > 0) { return; }
      }
      _walk(obj, url);
      return _children;
    }
  });

})(window.dtvClientData, window.angular);