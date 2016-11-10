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
      var oVals = [];
      var valsLength = 0;
      var s1 = 0;
      var d = 0;
      var angle = 0;
      var isDragging = false;
      var anim;
      var animStart;
      var animEnd;
      var children = element.children();
      // var meter = new FPSMeter();
      resize();

      // var cy = 0;
      var wy;
      var wyMargin = 50;

      function resize(e) {
        var ew = element[0].clientWidth;
        var eh = element[0].clientHeight;
        var children = element.children();
        vals = [];
        var ty = ew * 0.150;
        var tz = ew * 0.150;

        for(var i = 0; i < children.length; i++) {
        // for(var i = 0; i < 1; i++) {
          angular.element(children[i])[0].style.webkitTransform = 'translate3d(0px, ' + (-i*ty) + 'px, ' + (-i*tz) + 'px)';
          var y = 0;
          var z = 0;

          if(i !== 0) {
            y = (-i*ty);
            z = (-i*tz);
          }

          vals.push({
            elem: angular.element(children[i]),
            style: angular.element(children[i])[0].style,
            y: y,
            z: z,
            oy: y,
            complete: false
          });
          // console.log((-i*ty), (-i*tz))

          

          oVals.push({ y:(-i*ty), z:(-i*tz) });
        }

        wy = $window.innerHeight - angular.element(children[0])[0].getBoundingClientRect().top;
        // console.log(windowY);
        valsLength = vals.length;
      }

      function loop() {
        var radians = angle * Math.PI / 2; 
        var v = Math.sin(angle) * s1;

        vals.forEach(function(val, i) {


          if(val.y > 0) {
            var v2 = Math.sin(angle) * s1;
            if(d === Hammer.DIRECTION_DOWN) {
              if(vals[i+1]) {
                var cy = Math.abs((Math.abs(vals[i+1].y) / Math.abs(vals[1].oy)) - 1);
                cy = (cy >= 0.95) ? 1 : cy;
                var ny = (cy * wy);
                if(cy >= 0.95 && !val.complete) {
                  // ny = wy;
                  val.y = wy;
                  val.complete = true;
                } else if(!val.complete) {
                  val.y = ny;
                }
              }
            } else {
              if(vals[i+1]) {
                var cy = Math.abs((Math.abs(vals[i+1].y) / Math.abs(vals[1].oy)) - 1);
                cy = (cy >= 0.95) ? 1 : cy;
                var ny = (cy * wy);
                if(cy >= 0.95 && !val.complete) {
                  // ny = wy;
                  val.y = wy;
                  val.complete = true;
                } else if(!val.complete) {
                  val.y = ny;
                }
              }
            }




            // }

            if(d === Hammer.DIRECTION_UP && val.y <= 0) {  val.y = -1; }
          } else {
            val.y += v;
            val.z += v;           
          }
          val.style.webkitTransform = 'translate3d(0px, ' + val.y + 'px, ' + val.z + 'px)';
        });

        // console.log(vals[0].y);
        // if(d === Hammer.DIRECTION_UP && vals[0].y < -100 && !isDragging) {
          // console.log('001');
          // cancelAnimationFrame(anim);
          // animStart = requestAnimationFrame(loopToStart);
          // angle = 90;
        // } else if(d === Hammer.DIRECTION_DOWN && vals[valsLength-1].y > 100 && !isDragging) {
          // console.log('002');
          // cancelAnimationFrame(anim);
          // anim2 = requestAnimationFrame(loop2);
          // angle = 180;
        // } else {
          if(!isDragging) {
            s1 *= 0.970;
            vals.forEach(function(val) {
              val.s2 *= 0.970;
            });
            if(s1 < 0.001) {
              cancelAnimationFrame(anim);
            } else {
              anim = requestAnimationFrame(loop);
            }
          } else {
            anim = requestAnimationFrame(loop);
          }
        // }
        // meter.tick();
      }

      function loopToStart() {
        vals.forEach(function(val, i) {
          var ty = oVals[i].y;
          var tz = oVals[i].z;
          var dy = ty - val.y;
          var dz = tz - val.z;
          var vy = dy * 0.05;
          var vz = dz * 0.05;
          val.y += vy;
          val.z += vz;
          val.style.webkitTransform = 'translate3d(0px, ' + val.y + 'px, ' + val.z + 'px)';
        });
        if(vals[0].y >= -0.01) {
          cancelAnimationFrame(loopToStart);
        } else {
          animStart = requestAnimationFrame(loopToStart);
        }
      }

      function loopToEnd() {
        // var val = vals[valsLength-1];
        // var ty = 0;
        // var tz = 0;
        // var dy = ty - val.y;
        // var dz = tz - val.z;
        // var vy = dy * ease;
        // var vz = dz * ease;
        // val.y += vy;
        // val.z += vz;
        // val.style.webkitTransform = 'translate3d(0px, ' + val.y + 'px, ' + val.z + 'px)';
        // console.log(val.y);
        // if(vals.y >= -0.01) {
        //   cancelAnimationFrame(loopToStart);
        // } else {
        //   animStart = requestAnimationFrame(loopToStart);
        // }
        // console.log('HELLO - 2');
      }

      var mc = new Hammer.Manager(document.body, {});
      mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 0 }) );

      mc.on('panstart', function(e) {
        console.log('PAN_START');
        s1 = Math.abs(e.velocityY * 4);
        s1 = normalizeVelocity(s1);
        isDragging = true;
        cancelAnimationFrame(anim);
        cancelAnimationFrame(animStart);
        cancelAnimationFrame(animEnd);
        anim = requestAnimationFrame(loop);
      });

      mc.on('panend', function(e) {
        console.log('PAN_END');
        isDragging = false;
        s1 = Math.abs(e.velocityY * 4);
        s1 = normalizeVelocity(s1);
        isDragging = false;
        // if(d === Hammer.DIRECTION_UP && vals[0].y < -1) {
        //   cancelAnimationFrame(anim);
        //   animStart = requestAnimationFrame(loopToStart);
        // } else if(d === Hammer.DIRECTION_DOWN && vals[valsLength-2].y > 0) {
        //   cancelAnimationFrame(anim);
        //   cancelAnimationFrame(loopToStart);
        //   animEnd = requestAnimationFrame(loopToStart);
        // }
      });

      mc.on("panmove", function(e) {
        console.log('PAN_MOVE');
        if(e.direction === Hammer.DIRECTION_UP) {
          angle = 180;
        } else if(e.direction === Hammer.DIRECTION_DOWN) {
          angle = 90;
        }
        d = e.direction;
        s1 = Math.abs(e.velocityY * 4);
        s1 = normalizeVelocity(s1);
        vals.forEach(function(val) {
          val.s2 = s1;
        });
        isDragging = true;
      });

      function normalizeVelocity(v) {
        // return (v > 20) ? 15 : v;
        return v;
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