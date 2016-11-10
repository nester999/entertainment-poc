(function(angular, TweenMax, _) {
'use strict';

/**
 * Breakpoints for grid view
 * 
 * @width     {Number in px}
 * @columns   {Number}        Number of asset cards to display in a row
 * @spacingX  {Number in px}  Amount of spacing between cards
 * @spacingY  {Number in px}  Only works in grid view
 * @fontSize  {Number in em}  FontSize in ems for card
 *
 * TODO: Should we have this in CSS?
 *
 */

var breakPoints = [
  {maxWidth: 400,  columns:1, spacingX:0,  spacingY:20, fontSize:1 },
  {maxWidth: 1000, columns:2, spacingX:20, spacingY:20, fontSize:1 },
  {maxWidth: 1500, columns:3, spacingX:20, spacingY:20, fontSize:1.3},
  {maxWidth: 3000, columns:4, spacingX:20, spacingY:20, fontSize:1.3}
];

angular.module('dtv.cardLayout', [])

.directive('dtvCardLayout', ['$window', '$timeout',
  function($window) {
    return {
      restrict: 'AE',
      link: function($scope, $element, $attrs) {
        $element.addClass('dtv-card-layout');

        angular.forEach(breakPoints, function(item, i) {
          if(i === 0) { 
            breakPoints[i].minWidth = 0;
          } else {
            breakPoints[i].minWidth = breakPoints[i-1].maxWidth + 1;
          }
        });

        // Cache cards for resizing
        var cards = $element.find('.something');
        var container = $element.find('.dtv-card-layout-container');
        var cbp; // Current breakpoint

        resize();
        angular.element($window).bind('resize', resize);
        function resize() {
          var elementWidth = $element[0].clientWidth;
          cbp = _.find(breakPoints, function(item) {
            var min = item.minWidth;
            var max = item.maxWidth;

            if(elementWidth >= min && elementWidth < max) {
              return item;
            }
          });

          cbp.newElementWidth = (cbp.columns * cbp.spacingX) - cbp.spacingX;
          cbp.cardWidth = Math.round((elementWidth - cbp.newElementWidth) / cbp.columns);
          cbp.size = aspectRatioResize(cbp.cardWidth);

          if($attrs.layout === 'carousel') {
            layoutCarousel();
          } else {
            layoutGrid();
          }
        }

        function layoutCarousel(animate) {
          angular.forEach(cards, function(item, i) {
            var x = i * (cbp.cardWidth + cbp.spacingX);
            var css = {
              width: cbp.size.width,
              height: cbp.size.height,
              transform: 'translate3d(' + x + 'px, 0px, 0px)'
            };

            if(animate) {
              TweenMax.to(item, 1, css);
            } else {
              TweenMax.set(item, css);
            }
          });

          var containerSize = {
            width: (cards.length * (cbp.cardWidth + cbp.spacingX)) - cbp.spacingX,
            height: cbp.size.height
          };

          $element.css('height', containerSize.height);
          container.css(containerSize);
        }

        function layoutGrid(animate) {
          var row = 0;
          var col = 0;

          console.log(cbp.size);
          
          angular.forEach(cards, function(item) {
            var x = col * (cbp.size.width + cbp.spacingX);
            var y = row * (cbp.size.height + cbp.spacingY);

            console.log(cbp.size);

            var css = {
              width: cbp.size.width,
              height: cbp.size.height,
              transform: 'translate3d(' + x + 'px,' + y + 'px, 0px)'
            };

            col++;

            if(col > cbp.columns-1) {
              col = 0;
              row++;
            }

            if(animate) {
              TweenMax.to(item, 1, css);
            } else {
              TweenMax.set(item, css);
            }
          });

          var containerSize = {
            width: (cbp.columns * (cbp.size.width + cbp.spacingX)) - cbp.spacingX,
            height: ((row+1) * (cbp.size.height + cbp.spacingY)) - cbp.spacingY,
          };


          $element.css('height', containerSize.height);
        }

        var single;
        $attrs.$observe('layout', function(val) {
          if(!single) { single = true; return; }
          if(val === 'carousel') {
            layoutCarousel(true);
          } else {
            layoutGrid(true);
          }
        });
      }
    };
  }
]);

/**
 * Preserve aspect ratio of the orignal region.
 */

function aspectRatioResize(nw) {
  var ow = 450; // Original Card width
  var oh = 344; // Original Card Height
  return {width: nw, height: Math.round(oh * (nw/ow))};
}

})(window.angular, window.TweenMax, window._);