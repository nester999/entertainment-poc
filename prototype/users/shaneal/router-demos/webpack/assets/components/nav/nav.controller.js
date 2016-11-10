/*
 * This is an example of a file that gets loaded when the page renders.
 */

define(['angularAMD'], function() {
  var app = angular.module("dtvNav", []);
  
  app.controller('dtvNavCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.links = [
      {title: 'Shows'},
      {title: 'Movies'},
      {title: 'Guide'}
    ];

    $scope.selected = function(item) {
      console.log('ITEM SELECTED', item);
      // $location.path(item.title.toLowerCase());
    };

    $scope.deSelected = function(item) {
      console.log('ITEM DESELECTED', item);
    };

  }]);
  
  return app;
});