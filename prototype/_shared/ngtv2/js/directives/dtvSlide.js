(function() {
  'use strict';


  // <dtv-slide> Directive
  function dtvSlide() {


    function link($scope, $element, $attrs, ctrl) {
      $element.addClass('dtv-slide');
      if($scope.$last) { ctrl.ngRepeatDone(); }

      // Figure out why sometimes $destroy gets called more than once
      $scope.$on('$destroy', function() {
        ctrl.ngRepeatDone();
      });
    }


    return {
      restrict: 'EA',
      require: '^dtvCarousel',
      link: link
    };
  }


  angular
    .module('dtvCarousel')
    .directive('dtvSlide', dtvSlide);

})();