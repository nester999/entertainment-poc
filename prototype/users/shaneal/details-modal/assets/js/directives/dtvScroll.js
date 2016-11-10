(function(angular, IScroll) {
'use strict';

angular.module('dtv.scroll', [])

.directive('dtvScroll', ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    controller: function($scope) {
      this.refresh = function() {
        $scope.refresh();
      };
    },
    link: function($scope, element, attr) {
      console.log('dtv-scroll');
      var iScroll;
      var options = {
        scrollX: (attr.scrollX === 'true') ? true : false,
        scrollY: (attr.scrollY === 'true') ? true : false,
        snap: (attr.snap === 'true') ? true : false,
        snapSpeed: 400,
        momentum: (attr.momentum === 'true') ? true : false,
        // deceleration: 0.0006,
        keyBindings: false,
        scrollbars: false,
        fadeScrollbars: false,
        bounceEasing: 'quadratic'
      };

      $scope.refresh = function() {
        if(!iScroll) {
          console.log('----');
          iScroll = new IScroll(element[0], options);
        } else {
          iScroll.refresh();
        }

        console.log('refresh - called');
      };

      $scope.$on('$destroy', function () {
        if(iScroll) {
          iScroll.destroy();
          iScroll = null;
        }
      });

      $scope.$on('iScrollRefresh', function() {
        $scope.refresh();
      });

      element.addClass('dtv-scroll');
    }
  };
}])

.directive('dtvScrollInit', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    require: '^dtvScroll',
    link: function($scope, element, attr, dtvScroll) {
      $timeout(function(){
        dtvScroll.refresh();
      });
    }
  };
}]);

})(window.angular, window.IScroll);