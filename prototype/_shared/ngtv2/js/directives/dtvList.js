// TODO: REFACTOR THIS NONSENSE

(function(angular, TweenMax, $, IScroll, _) {
'use strict';

var DEFAULT_CARD_SIZE = {
  width: 340,
  height: 236,
  fontSize: 16
};

var CAROUSEL_OPTIONS = {
  spacing: 20
};

var app = angular.module('dtv.list', []);
app.directive('dtvList', ['$rootScope', '$window', '$timeout', '$compile',
  function($rootScope, $window, $timeout, $compile) {
    return {
      restrict: 'AE',
      controller: DtvListCtrl,
      scope: {
        id: '@',
        layout: '=',
        breakPoints: '=',
        scrollable: "="
      },
      link: function(scope, element, attr) {
        element.wrap('<div class="dtv-list-tup"></div>');
        element.addClass('dtv-list');
        var container = element.parent();

        var layout = '';
        var breakPoints;
        var cbp;            // Current Breakpoint
        var items;
        var scrollable = true;
        var template = '<div class="dtv-carousel-btn prev" ng-click="prev()"><i class="icon icon-dtv2-chevron-left"></i></div><div class="dtv-carousel-btn next" ng-click="next()"><i class="icon icon-dtv2-chevron-right"></i></div>';
        var linkFn = $compile(template);
        var content = linkFn(scope);

        if (scope.scrollable === false) {
          scrollable = false;
        }

        if(scrollable) {
          container.append(content);
        } 

        var containerWidth;

        var iScroll;
        var iScrollOptions = {
          scrollX: true,
          scrollY: false,
          lockDirection: true,
          snap: true,
          snapSpeed: 400,
          momentum: false,
          deceleration: 0.0006,
          keyBindings: false,
          scrollbars: false,
          fadeScrollbars: false,
          bounceEasing: 'quadratic',
          eventPassthrough: true,
          // preventDefault: false
        };


        // Watching //
        var one = false;
        scope.$watch('layout', function(val) {
          if(!val) {
            return;
          }
          layout = val;
          resize();
          one = true;
        });

        scope.$watch('breakPoints', function(val) {
          if(!val) { return; }
          breakPoints = initBreakpoints(val);
        });

        $rootScope.$on('ngRepeatDone', function(e, val) {
          if(val.id === scope.id) {
            items = element.children();
            // Append class for each li
            angular.forEach(items, function(item) {
              angular.element(item).addClass('dtv-list-item');
            });
            resize();
          }
        });

        scope.next = function() {
          if(iScroll) {
            iScroll.goToPage(iScroll.currentPage.pageX + 3, 0, 500);
          }
        };

        scope.prev = function() {
          if(iScroll) {
            iScroll.goToPage(iScroll.currentPage.pageX - 3, 0, 500);
          }
        };

        // Private //
        function resize() {
          if(!items) { return; }
          containerWidth = container[0].clientWidth;
          if(layout === 'carousel') {
            container.addClass('carousel-layout');
            container.removeClass('grid-layout');
            carousel();
            if(!iScroll) {
              iScroll = new IScroll(container[0], iScrollOptions);
              iScroll.on('scrollStart', function() {
                window.dragging = true;
              });
              iScroll.on('scrollEnd', function() {
                setTimeout(function () {
                  window.dragging = false;
                }, 10);
              });
            }
          } else if(layout === 'grid') {
            container.addClass('grid-layout');
            container.removeClass('carousel-layout');
            grid();
            if(iScroll) {
              iScroll.destroy();
              iScroll = null;
            }
          }
          container.parent().addClass('initalized');
        }

        function grid(animate) {
          cbp = currentBreakpoint(breakPoints);
          if(!cbp) { return; }
          cbp.spacingX = (!cbp.spacingX) ? 40 : cbp.spacingX;
          cbp.spacingY = (!cbp.spacingY) ? 40 : cbp.spacingY;
          var cardWidth = (containerWidth - ((cbp.columns+1) * 20)) / cbp.columns;
          cbp.size = aspectRatioResize(cardWidth);

          var row = 0;
          var col = 0;
          angular.forEach(items, function(item) {
            var x = col * (cbp.size.width + cbp.spacingX);
            var y = row * (cbp.size.height + cbp.spacingY);

            var css = {
              width: cbp.size.width,
              height: cbp.size.height,
              webkitTransform: 'translate3d(' + x + 'px,' + y + 'px, 0px)',
              fontSize: (cbp.size.width * 16) / DEFAULT_CARD_SIZE.width
            };

            col++;

            if(col > cbp.columns-1) {
              col = 0;
              row++;
            }

            if(animate) {
              TweenMax.to(item, 1, css);
            } else {
              angular.element(item).css(css);
            }
          });

          if((items.length/row) % 1 !== 0) {
            row++;
          }

          var containerSize = {
            // width: (cbp.columns * (cbp.size.width + cbp.spacingX)) - cbp.spacingX,
            height: row * (cbp.size.height + cbp.spacingY)
          };

          element.css(containerSize);
          container.css('height', containerSize.height);
        }

        function carousel(animate) {
          angular.forEach(items, function(item, i) {
            var x = i * (DEFAULT_CARD_SIZE.width + CAROUSEL_OPTIONS.spacing);
            var css = {
              width: DEFAULT_CARD_SIZE.width,
              height: DEFAULT_CARD_SIZE.height,
              webkitTransform: 'translate3d(' + x + 'px, 0px, 0px)'
            };

            if(animate) {
              TweenMax.to(item, 1, css);
            } else {
              angular.element(item).css(css);
            }
          });

          var containerSize = {
            width: items.length * Math.round(DEFAULT_CARD_SIZE.width + CAROUSEL_OPTIONS.spacing),
            height: DEFAULT_CARD_SIZE.height,
            fontSize: ((23 * DEFAULT_CARD_SIZE.width) / 450) + 'px'
          };

          element.css(containerSize);
          container.css('height', containerSize.height);
        }

        // Initalize breakpoints
        function initBreakpoints(breakPoints) {
          if(!breakPoints) {
            return;
          }
          var bp = angular.copy(breakPoints);
          angular.forEach(bp, function(item, i) {
            if(i === 0) { 
              bp[i].minWidth = 0;
            } else {
              bp[i].minWidth = bp[i-1].maxWidth + 1;
            }
          });
          return bp;
        }

        function currentBreakpoint(breakPoints) {
          if(!breakPoints) {
            return;
          }

          return _.find(breakPoints, function(item) {
            var min = item.minWidth;
            var max = item.maxWidth;
            if(containerWidth >= min && containerWidth <= max) {
              return item;
            }
          });
        }

        angular.element($window).bind('resize', resize);
      }
    };
  }
]);

/**
 * DTV List controller
 */
var DtvListCtrl = ['$scope',
  function($scope) {

  }
];


/**
 * Preserve aspect ratio of the orignal region.
 */
function aspectRatioResize(nw) {
  return {width: nw, height: Math.round(DEFAULT_CARD_SIZE.height * (nw / DEFAULT_CARD_SIZE.width))};
}

})(window.angular, window.TweenMax, window.jQuery, window.IScroll, window._);