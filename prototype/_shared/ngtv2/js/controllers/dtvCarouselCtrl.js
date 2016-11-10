(function() {
  'use strict';


  dtvCarouselCtrl.$inject = ['$scope'];
  function dtvCarouselCtrl($scope) {
    var self = this;

    // If no id is present create a dumy one so other components
    // can communicate with the Carousel Service
    $scope.id = $scope.id || Math.random().toString(36).substring(7);
    self.id = $scope.id;

    self.ngRepeatDone = function() { $scope.ngRepeatDone(); };
    self.refresh = function() { $scope.refresh(); };
  }


  angular
    .module('dtvCarousel')
    .controller('dtvCarouselCtrl', dtvCarouselCtrl);

})();