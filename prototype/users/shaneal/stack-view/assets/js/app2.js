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
      var s2 = 0;
      var angle = 0;
      var continueLoop = true;
      var anim;
      var children = element.children();

      resize();

      function resize(e) {
        var ew = element[0].clientWidth;
        var eh = element[0].clientHeight;
        var children = element.children();
        vals = [];
        var tz = ew * 0.150;
        var ty = ew * 0.150;

        for(var i = 0; i < children.length; i++) {
          angular.element(children[i])[0].style.webkitTransform = 'translate3d(0px, ' + (-i*ty) + 'px, ' + (-i*tz) + 'px)';
          vals.push({
            style: angular.element(children[i])[0].style,
            y: (-i*ty),
            z: (-i*tz),
            o: false
          });
        }
      }

      function loop() {
        var radians = angle * Math.PI / 2; 
        var v = Math.sin(angle) * s1;
        var v2 = Math.sin(angle) * s1;
        v2 *= 5;

        vals.forEach(function(val) {
          if(val.y >= 0) {            
            val.y += v2;
            val.z = val.z;
          } else {
            val.y += v;
            val.z += v;
          }

          val.style.webkitTransform = 'translate3d(0px, ' + val.y + 'px, ' + val.z + 'px)';
        });

        if(!continueLoop) {
          s1 *= 0.970;
          s2 *= 0.970;
          if(s1 < 0.001) {
            cancelAnimationFrame(anim);
            // console.log('CANCEL ANIMATION FRAME');
          } else {
            anim = requestAnimationFrame(loop);
          }
        } else {
          anim = requestAnimationFrame(loop);
        }
      }

      var mc = new Hammer.Manager(document.body, {});
      mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 0 }) );

      mc.on('panstart', function() {
        // console.log('PAN_START');
        cancelAnimationFrame(anim);
        continueLoop = true;
        anim = requestAnimationFrame(loop);
      });

      mc.on('panend', function(e) {
        // console.log('PAN_END');
        continueLoop = false;
        s1 = Math.abs(e.velocityY * 4);
      });

      mc.on("panmove", function(e) {
        // console.log('PAN_MOVE');
        if(e.direction === Hammer.DIRECTION_UP) {
          angle = 180;
        } else if(e.direction === Hammer.DIRECTION_DOWN) {
          angle = 90;
        }
        s1 = Math.abs(e.velocity * 4);
      });

      function getTranslate3d(transform) {
        var _t = transform;
        _t = _t.replace('translate3d(', '').replace(')', '');
        _t = _t.split(',');
        for(var i = 0; i < 3; i++) {
          _t[i] = _t[i].replace('px', '').replace(' ', '');
        }
        return { x:_t[0], y:_t[1], z:_t[2] };
      }

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