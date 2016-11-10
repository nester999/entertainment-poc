/* LOOK AT dtvCardStackView */

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
      var s1 = 0;
      var angle = 0;
      var d = 0;
      var continueLoop = true;
      var isDragging = false;
      var anim;
      var children = element.children();
      var meter = new FPSMeter();

      var s = 0;

      resize();

      function resize(e) {
        var ew = element[0].clientWidth;
        var eh = element[0].clientHeight;
        var children = element.children();
        vals = [];
        var ty = ew * 0.150;
        var tz = ew * 0.150;

        s = tz;

        for(var i = 0; i < children.length; i++) {
          angular.element(children[i])[0].style.webkitTransform = 'translate3d(0px, ' + (-i*ty) + 'px, ' + (-i*tz) + 'px)';
          vals.push({
            elem: angular.element(children[i]),
            style: angular.element(children[i])[0].style,
            y: (-i*ty),
            z: (-i*tz),
            oy: (-i*ty),
            oz: (-i*tz),
            s2: 0,
            d: false
          });

        }
      }

      function loop() {
        var radians = angle * Math.PI / 2; 
        var v = Math.sin(angle) * s1;

        vals.forEach(function(val, i) {
          if(val.y > 0) {
            var v2 = Math.sin(angle) * val.s2;
            v2 *= 4.5;
            val.y += v2;
            val.z = val.z;
            if(d === Hammer.DIRECTION_UP && val.y < 0) { val.y = 0; val.z = 0; }
          } else {
            val.y += v;
            val.z += v;
          }
          TweenMax.set(val.elem, {
            y: val.y,
            z: val.z
          });
        });

        if(d === Hammer.DIRECTION_UP && vals[0].y < -100 && !continueLoop) {
          cancelAnimationFrame(anim);
          animateStackStart();
        }
        else if(!continueLoop) {
          s1 *= 0.960;
          vals.forEach(function(val) {
            val.s2 *= 0.960;
          });
          if(s1 < 0.001) {
            cancelAnimationFrame(anim);
          } else {
            anim = requestAnimationFrame(loop);
          }
        } else {
          anim = requestAnimationFrame(loop);
        }
        // meter.tick();
      }

      var mc = new Hammer.Manager(document.body, {});
      mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 0 }) );

      function animateStackStart() {
        vals.forEach(function(val, i) {
          TweenMax.to(val.elem, 0.75, {
            y: val.oy,
            z: val.oz,
            ease: Power2.easeOut
          });
          val.y = val.oy;
          val.z = val.oz;
        });
      }

      mc.on('panstart', function(e) {
        // console.log('PAN_START');
        s1 = Math.abs(e.velocityY * 4);
        continueLoop = true;
        cancelAnimationFrame(anim);
        anim = requestAnimationFrame(loop);
      });

      mc.on('panend', function(e) {
        // console.log('PAN_END');
        continueLoop = false;
        s1 = Math.abs(e.velocityY * 4);
        isDragging = false;

        if(d === Hammer.DIRECTION_UP && vals[0].y < 0) {
          cancelAnimationFrame(anim);
          animateStackStart();
        }
      });

      mc.on("panmove", function(e) {
        // console.log('PAN_MOVE');
        if(e.direction === Hammer.DIRECTION_UP) {
          angle = 180;
        } else if(e.direction === Hammer.DIRECTION_DOWN) {
          angle = 90;
        }
        d = e.direction;
        s1 = Math.abs(e.velocityY * 4);
        if(s1 > 14) { s1 = 15; }
        vals.forEach(function(val) {
          val.s2 = s1;
        });
        isDragging = true;
        // console.log(e.velocityY);
        // loop();
      });
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