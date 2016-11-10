angular.module('dtv.imageFill', [])

.directive('dtvImageFill', function($window) {
  return {
    restrict: 'AE',
    link: function(scope, element, attr) {
      element.addClass('dtv-image-fill');

      var img = new Image();
      img.src = attr.src;
      img.onload = imageLoaded;

      function imageLoaded() {
        element.css('background-image', 'url(' + img.src + ')');
        element.addClass('loaded');
      }
    }
  };
});
/**
 * @description
 *
 * @example
 * 
 *
 */

angular.module('dtv.cardStack', [])

.directive('dtvCardStackViewContainer', function() {
  return {
    restrict: 'AE',
    controller: 'DtvCardStackViewContainerCtrl',
    link: function(scope, element, attr) {
      element.addClass('dtv-card-stack-container');
    }
  };
})

.directive('dtvCardStackView', function($window, $document) {
  return {
    restrict: 'AE',
    scope: {
      data: '='
    },
    controller: 'DtvCardStackViewCtrl',
    require: '^dtvCardStackViewContainer',
    link: function(scope, element, attr, ctrl) {
      element.addClass('dtv-card-stack-view');
      angular.element($window).bind('resize', resize);

      var vals = [];
      var angle = 0;
      var v = 0;
      var d = 0.98;
      var direction = 0;
      var endLoop = false;
      var children = element.children();

      resize();

      function resize(e) {
        var ew = element[0].clientWidth;
        var eh = element[0].clientHeight;
        var children = element.children();
        vals = [];
        var tz = ew * 0.125;
        var ty = ew * 0.125;

        for(var i = 0; i < children.length; i++) {
          TweenMax.set(angular.element(children[i]), {
            y: (-i*ty),
            z: (-i*tz),
            force3D: true
          });
          vals.push({
            elem: angular.element(children[i]).style,
            y: (-i*ty),
            z: (-i*tz),
            y2: 0,
            // opacity: 1
          });
        }
      }

      function loop() {
        for(var i = 0; i < children.length; i++) {
          var val = vals[i];
          var elem = val.elem;

          if(endLoop) {
            v *= 0.95;
          }

          if(val.y >= 0) {
            val.z = val.z;
            val.y += v * 7;
          } else {
            val.z += v;
            val.y += v;
          }

          TweenMax.to(elem, 1, {
            y: val.y,
            z: val.z,
            force3D: true,
            ease: Expo.easeOut
          });
        }
      }

      var mc = new Hammer.Manager(document.body, {});
      mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 0 }) );

      mc.on('panstart', function() {
        // console.log('panstart');
        endLoop = false;
      });

      mc.on('panend', function(e) {
        // cancelAnimationFrame(animationLoop);
        endLoop = true;
      });

      mc.on("panmove", function(e) {
        // console.log('panup, pandown');
        if(e.direction === Hammer.DIRECTION_UP) {
          angle = 180;
        } else if(e.direction === Hammer.DIRECTION_DOWN) {
          angle = 90;
        }
        direction = e.direction;
        v = e.velocityY * -10;
      });

      (function animationLoop(){
        loop();
        requestAnimationFrame(animationLoop, document.body);
      })();
    }
  };
})

.directive('dtvCardStack', function() {
  return {
    restrict: 'AE',
    link: function(scope, element, attr) {
      element.addClass('dtv-card-stack');

    }
  };
})

.service('dtvCardStackService', function() {
  return {

  }
})

.controller('DtvCardStackViewContainerCtrl', function($scope) {

})

.controller('DtvCardStackViewCtrl', function($scope) {

});


angular.module('homeApp', ['dtv.imageFill', 'dtv.cardStack'])
  .controller('HomeCtrl', ['$scope', '$rootScope', HomeCtrl]);

function HomeCtrl($scope, $rootScope) {
  $scope.images = [
    {
      src: "http://dummyimage.com/300x175/000/fff.png"
    },
    {
      src: "http://dummyimage.com/300x175/000/fff.png"
    },
    {
      src: "http://dummyimage.com/300x175/000/fff.png"
    }
  ];

  $scope.addItem = function() {
    console.log('HELLOOOOO');
  };
}