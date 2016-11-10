(function() {
  'use strict';


  var dtvNavigation = function(func) {
    ret.$inject = ['$dtvCarousel'];
    function ret($dtvCarousel) {


      function link($scope, $element, $attrs, ctrl) {
        $element.bind('click', click);

        // Get a reference to the carousel
        var Carousel;
        $dtvCarousel.get(ctrl.id).then(function(carousel) {
          Carousel = carousel;
        });


        function click() {
          $scope.$apply(function() { Carousel[func](); });
        }


        $scope.$on('$destroy', function() {
          $element.unbind('click');
          Carousel = null;
        });
      }


      return {
        restrict: 'EA',
        require: '^dtvCarousel',
        link: link
      };
    }

    return ret;
  };


  angular
    .module('dtvCarousel')
    .directive('dtvNextSlide', new dtvNavigation('nextSlide'))
    .directive('dtvPrevSlide', new dtvNavigation('prevSlide'))
    .directive('dtvNextPage',  new dtvNavigation('nextPage'))
    .directive('dtvPrevPage',  new dtvNavigation('prevPage'));

})();