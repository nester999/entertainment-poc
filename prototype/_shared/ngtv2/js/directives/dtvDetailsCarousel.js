(function(angular) {
'use strict';

angular.module('dtv.detailsCarousel', [])

.directive('dtvDetailsCarousel', ['$window', '$document', '$timeout', 
  function($window, $document, $timeout) {
    return {
      restrict: 'A',
      require: '?^dtvScroll',
      scope: {
        length: '='
      },
      link: function(scope, element, attr, dtvScroll) {
        var w = 603; // Hardcoded width in details modal in CSS
        var h = 559; // Hardcoded height in details modal in CSS
        var topNavHeight = 45; // // Hardcoded height of topnav
        var spacing = 0;
        var children;
        var wWidth = $window.innerWidth;
        var wHeight = $window.innerWidth;
        var peak = 0.05; // How much next Modal sticks out

        scope.$watch('length', function() {
          children = element.find('li');
          resize();
        });

        function resize() {
          wWidth = $window.innerWidth;
          wHeight = $window.innerHeight;
          var p = wWidth - (wWidth * (1 - peak));
          spacing = (wWidth*0.5 - w*0.5) + w - p;

          $(element).parent().width(spacing); // Hard coded, put elsewehere
          element.css('width', (scope.length)*(spacing));
          element.css('height', h);
          element.css('margin-left', spacing*0.5 - w*0.5);
          element.css('top', (wHeight-topNavHeight)*0.5 - h*0.5);
          resizeChildren();
        }

        function resizeChildren() {
          angular.forEach(children, function(child, i) {
            var x = 0;
            var _child = angular.element(child);
            if(i !== 0) { x = (spacing)*i; }
            _child.css('transform', 'translate3d(' + x + 'px, 0px, 0px)');
          });

          $timeout(function() {
            dtvScroll.refresh();
          });
        }

        element.addClass('dtv-details-carousel');
        angular.element($window).bind('resize', resize);

        scope.$on('$destroy', function () {
          angular.element($window).unbind('resize', resize);
        });
      }
    };
  }
]);

})(window.angular);

