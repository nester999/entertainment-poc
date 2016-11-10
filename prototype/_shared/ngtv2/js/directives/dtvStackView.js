(function(angular, TweenMax) {

var navHeight = 55;

// Default size of stack + label
var DEFAULT_STACK_CONTAINER_SIZE = {
  width: 340,
  height: 302,
  spacingX: 30,
  spacingY: 40,
  gutter: 25,
  fontSize: 16
};

var DEFAULT_STACK_SIZE = {
  width: 340,
  height: 262,
  y: 29,
  z: 12
};

var DEFAULT_CARD_SIZE = {
  width: 340,
  height: 236,
  fontSize: 16
};

angular.module('dtv.stackView', [])


.directive('dtvStackViewLayout', ['$window', '$rootScope',
  function($window, $rootScope) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        var items = [];

        $rootScope.$on('ngRepeatDone', function(e, val) {
          if(val.id === $attr.id) {
            items = $element.children();
            resize();
          }
        });

        function resize() {
          var height = $window.innerHeight - navHeight;
          $element.css({height: height});

          height = (height - DEFAULT_STACK_CONTAINER_SIZE.spacingY - (DEFAULT_STACK_CONTAINER_SIZE.gutter * 2)) / 2;
          var obj = calcRatio('height', DEFAULT_STACK_CONTAINER_SIZE, height);

          var row = 0;
          var col = 0;
          var maxCol = Math.round(items.length/ 2);
          angular.forEach(items, function(item, i) {
            var x = (col * (obj.width + DEFAULT_STACK_CONTAINER_SIZE.spacingX)) + DEFAULT_STACK_CONTAINER_SIZE.gutter;
            var y = row * (obj.height + DEFAULT_STACK_CONTAINER_SIZE.spacingY) + DEFAULT_STACK_CONTAINER_SIZE.gutter;

            col++;

            if(col > maxCol-1) {
              $element.css({width: x + obj.width + obj.gutter});
              col = 0;
              row++;
            }

            var css = {
              width: obj.width,
              height: obj.height,
              webkitTransform: 'translate3d(' + x + 'px,' + y + 'px, 0px)',
              fontSize: obj.fontSize
            };

            angular.element(item).css(css);         
          });
        }

        angular.element($window).bind('resize', resize);
      }
    };
  }
])

.directive('dtvStackView', ['$window', '$rootScope',
  function($window, $rootScope) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        var width = $window.innerWidth;
        var height = $window.innerHeight - navHeight;

        

        var container = angular.element($element).parent(); // Stack Container

        var items;

        $rootScope.$on('ngRepeatDone', function(e, val) {
          if(val.id === $attr.id) {
            items = $element.children();
            resize();
          }
        });

        function resize() {
          var parentWidth = container[0].clientWidth;
          var obj = calcRatio('width', DEFAULT_STACK_SIZE, parentWidth);
          $element.css({ width: obj.width, height: obj.height });

          angular.forEach(items, function(item, i) {
            var y = 0;
            var z = 0;

            if(i !== 0) {
              y = i * obj.y;
              z = i * obj.z;
            }

            var css = {
              width: parentWidth,
              height: obj.height - 20,
              webkitTransform: 'translate3d(' + 0 + 'px,' + -y + 'px,' + -z + 'px)',
              zIndex: items.length - i
            };

            angular.element(item).css(css);
          });
        }

        angular.element($window).bind('resize', resize);
      }
    };
  }
]);

/**
 * Calculates aspect ratio values of a given object
 *
 * @param {String} Key to calculate default ratio off of
 * @param {Object} Object to loop through
 * @return {Number} New Value
 *
 */
function calcRatio(key, obj, val) {
  var _obj = {};
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      if(key === prop) {
        _obj[key] = val;
      } else {
        _obj[prop] = Math.round(obj[prop] * (val / obj[key]));
      }
    }
  }
  return _obj;
}

})(window.angular, window.TweenMax);