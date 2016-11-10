(function(angular, Hammer, TweenMax) {
  'use strict';


  // Sanity Check
  if(!angular) { console.error('angular is not defined'); }
  if(!Hammer) { console.error('Hammer.js is not defined'); }

  // <dtv-carousel> Directive
  dtvCarousel.$inject = ['$window', '$document', '$timeout', '$dtvCarousel'];
  function dtvCarousel($window, $document, $timeout, $dtvCarousel) {


    function link(scope, element, attrs, ctrl) {

      // Slide delta. Used for CSS animations
      var slideDelta;

      var animationEngine = {
        isCss: function() {
          return options.animationEngine.toLowerCase() === 'css';
        },
        isJs: function() {
          return options.animationEngine.toLowerCase() === 'js';
        }
      };

      // Merge default options and scope options
      var options = angular.merge(defaultOptions, scope.options);

      // Cached <slide> dom elements
      var slides;

      // Is the directive initalized?
      var initalized;

      // Scrollable container
      var container = angular.element(element[0].querySelector(scope.containerSelector));

      // Snap Points
      var snapPoints = [];

      // Carousel
      var $currentCarousel;

      // Reference to the carousel control objectf rom the Carousel service
      var control;


      // <slide> directive calls this method when when ngRepeat has finished
      // rendering dom elements so we can get access to width, ect.

      scope.ngRepeatDone = function() {
        // Get DOM slides
        slides = element[0].querySelectorAll('.dtv-slide');
        if(!initalized) {
          initalized = true;
          element.addClass('initalized');
          initCarouselService();
        }

        // Initalize values
        scope.refresh();

        // Now that values are know go to the inital index
        control.toIndex(control.slideIndex);
      };

 
      function initCarouselService() {
        $currentCarousel = $dtvCarousel.add(ctrl.id);
        control = $currentCarousel.control;

        // Listen for refresh
        $currentCarousel.refresh(function() {
          scope.refresh();
        });

        // Callback for when slideIndexChanges from service
        $currentCarousel.indexChanged(function(type) {
          changeSlide(false, type);
        });  

        // Enable Carousel
        $currentCarousel.onEnable(function() {
          initHammer();
        });

        // Disable Carousel
        $currentCarousel.onDisable(function() {
          destroyHammer();
        });
      }


      // Recalculates sizing for the carousel
      scope.refresh = function() {
        if(!slides[0]) {
          console.error('Define a carousel selector');
          return;
        }


        // Get the style property for the slide and element
        var slideStyle = slides[0].currentStyle || $window.getComputedStyle(slides[0]);

        // Get the style property for the element
        var elementStyle = element[0].currentStyle || $window.getComputedStyle(element[0]);

        // Get element width
        var elementWidth = parseFloat(elementStyle.width.replace('px', ''));

        var slideWidth = parseFloat(slideStyle.width.replace('px', ''));
        control.slideMargin = parseFloat(slideStyle.marginRight.replace('px', ''));


        // Computer slide width (px). The full width is width + margin
        control.slideWidth = slideWidth + control.slideMargin;

        control.slideLength = slides.length;

        // Calculate slide delta as percent
        slideDelta = (control.slideWidth / elementWidth) * 100;

        // Compute the amount of visible slides in container.
        control.visibleSlides = Math.ceil(elementWidth / control.slideWidth);

        // Compute number of pages
        control.pageLength = Math.ceil(control.slideLength / control.visibleSlides);


        // Recalculate snap points
        calcSnapPoints();
      };


      // Change the slide
      function changeSlide(resize, type) {

        var x;

        if(animationEngine.isCss()) {
          x = -(slideDelta * control.slideIndex);
          translateX(x, '%');
          return;
        }


        // If the browser is resizing do not animate
        if(resize) {
          x = -(control.slideWidth * control.slideIndex);
          translateX(x, 'px');
          return;
        }


        // TODO: Make option for animating with tweenmax or just CSS
        TweenMax.to(container, options.tweenOptions[type].duration, {
          transform: 'translateX(' + -(control.slideWidth) * control.slideIndex + 'px)',
          onUpdate: function() {
            if(!options.onUpdate) { return; }
            var currentX = this.target[0]._gsTransform.x;
            updatePosition(currentX);
          },
          overwrite: 'all',
          ease: eval(options.tweenOptions[type].ease)
        });

        // Calculate the current position of the slider (px) so
        // when dragging it has the correct offset (see below Hammer.panleft or Hammer.panright)
        resetPosition = -(control.slideWidth * control.slideIndex);
      }


      //////////////////////////////
      // Drag and swipe functions //
      //////////////////////////////

      // Current offset for the carousel
      var resetPosition = 0;

      // Current position of the carousel
      var positionX = 0;

      // When users reaches the begining or the end of the carousel
      // add some friction so they cannot drag the carousel off screen
      var friction = 0.3;

      // Max amount that the carousel can be dragged
      var maxWidth;

      // Check if swipe is detected see panend/pancancel
      var swipe = false;

      var hammer;


      initHammer();

      Hammer.Swipe({
        threshold: 10,
        velocity: 0.35
      });

      // Init hammer
      function initHammer() {
        if(hammer) { return; }
        hammer = new Hammer(element[0], {
          drag_block_horizontal: false,
          drag_block_vertical: false,
          domEvents: true
        });

        hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 9, velocity: 0.25 });
        hammer.on('panstart', panStart);
        hammer.on('panleft panright', onPan);
        hammer.on('panend pancancel', onPanEnd);
        hammer.on('swipeleft swiperight', onSwipe);
      }


      // Start drag handler
      // Remover pointer events so the click handler on a list item inside
      // the carousel does not get fired when user is dragging and releases the mouse

      var flag = false;
      var lastX = 0;
      function panStart() {
        element.css('pointer-events', 'none');
        maxWidth = ((control.slideWidth + control.slideMargin) * (control.slideLength-control.visibleSlides));
        container.addClass('dtv-noanimate');
      }


      // Drag handler
      function onPan(e) {
        positionX = resetPosition + e.deltaX;
        if(positionX > 0) {
          positionX *= friction;
        } else if(positionX < -maxWidth) {
          if(!flag) {
            flag = true;
            lastX = e.deltaX;
          }

          positionX += (lastX - e.deltaX) * (1-friction);
        }


        if(animationEngine.isCss()) {
          translateX(positionX, 'px');  
        } else {
          TweenMax.set(container, { transform: 'translateX(' + positionX + 'px)' });
        }


        if(options.onUpdate) {
          updatePosition(positionX);
        }
      }

      
      // Drag Ended
      function onPanEnd() {
        element.css('pointer-events', 'initial');
        container.removeClass('dtv-noanimate');

        // If a swipe is detected do not change slide
        if(swipe) { swipe = false; return; }


        var sp = getSnapPoint();
        if(sp === control.slideIndex || flag) {
          changeSlide(false, $dtvCarousel.const.TWEEN_SNAP);
        } else {
          scope.$apply(function() {
            control.toIndex(sp);
          });
        }

        // Reset Flag
        flag = false;
      }


      // Swipe handler 
      function onSwipe(e) {
        swipe = true;
        flag = false;

        var sp = getSnapPoint();


        if(sp === 0 && e.type === 'swiperight') {
          changeSlide(false, $dtvCarousel.const.TWEEN_SNAP);
          return;
        }


        if(positionX < -maxWidth && e.type === 'swipeleft') {
          changeSlide(false, $dtvCarousel.const.TWEEN_SNAP);
          return;
        }


        scope.$apply(function() {
          $timeout(function() {
            if(e.type === 'swipeleft') {
              if(options.onSwipe === $dtvCarousel.onSwipe.Slide) {
                control.nextPage();
              } else {
                control.nextSlide();
              }
            } else {
              if(options.onSwipe === $dtvCarousel.onSwipe.Page) {
                control.prevPage();
              } else {
                control.prevSlide();
              }
            }
          });
        });
      }


      // Send psoition values back to and subscribers
      function updatePosition(x) {
        var slidePercent;
        var pagePercent;
        
        slidePercent = -(x / control.slideWidth);
        pagePercent = -(x / (control.slideWidth * control.visibleSlides));


        if(slidePercent === 0) { slidePercent = 0; }
        if(pagePercent === 0)  { pagePercent  = 0; }


        $currentCarousel.positionChanged({
          slidePercent: slidePercent,
          pagePercent: pagePercent
        });
      }


      // Calculate snap points
      function calcSnapPoints() {
        var i = 0;
        for(; i < control.slideLength; i++) {
          snapPoints.push(-i * control.slideWidth);
        }
      }


      // Gets the best snap point and returns the index of the slide
      function getSnapPoint() {
        // Store each difference between current position and each snap point.
        var currentDiff;

        // Store the current best difference.
        var minimumDiff;

        // Best snap position.
        var snapIndex;

        // Loop through each snap location
        // and work out which is closest to the current position.
        var i = 0;
        for(; i < snapPoints.length; i++) {
          // Calculate the difference.
          currentDiff = Math.abs(positionX - snapPoints[i]);
          
          // Works out if this difference is the closest yet.
          if(minimumDiff === undefined || currentDiff < minimumDiff) {
            minimumDiff = currentDiff;
            snapIndex = i;
          }
        }
        return snapIndex;
      }


      function destroyHammer() {
        if(hammer) {
          hammer.destroy();
          hammer = null;
        }
      }


      /////////////////////
      // Resize Carousel //
      /////////////////////


      // Resizes the carousel
      // Since the transition is defined in CSS and we don't want to animate the carousel
      // during resize add a temporarily class thats disables transition.
      var rt;
      var animate = true;
      var _visibleSlides;
      angular.element($window).bind('resize', function() {
        if(animate) {
          animate = false;
          container.addClass('dtv-noanimate');
        }


        // Recalculate slide dimentions
        scope.refresh();

        // Only resize if the amount fo visible items has changed
        if(animationEngine.isCss()) {
          if(control.visibleSlides !== _visibleSlides) {
            control.toIndex(control.slideIndex, true);
            _visibleSlides = control.visibleSlides;
          }
        } else {
          changeSlide(true);
        }
        

        $timeout.cancel(rt);
        rt = $timeout(function() {
          container.removeClass('dtv-noanimate');
          animate = true;
        }, 500);
      });


      // Add .ss-noanimate class to remove animation when browser is resizing
      // or when user just wants to disable it.

      if(animationEngine.isCss()) {
        var css = '.dtv-noanimate { transition: none !important; }';
        var head = $document.find('head')[0];
        angular.element(head).append('<style>' + css + '</style>');
      }

      // Clean up
      scope.$on('$destroy', function() {
        angular.element($window).unbind('resize');
        destroyHammer();
        $dtvCarousel.destroy(ctrl.id);
      });

      //////////////////////
      // Helper Functions //
      //////////////////////

      function translateX(x, unit) {
        container.css('-webkit-transform', 'translateX(' + x + unit + ')');
        container.css('-moz-transform', 'translateX(' + x + unit + ')');
        container.css('-ms-transform', 'translateX(' + x + unit + '');
        container.css('transform', 'translateX(' + x + unit + ')');
      }
    }

    // Default options
    var defaultOptions = {
      tweenOptions: {
        slide: {
          duration: 0.75,
          ease: 'Power3.easeOut'
        },
        page: {
          duration: 0.75,
          ease: 'Power3.easeOut'
        },
        snap: {
          duration: 0.75,
          ease: 'Power3.easeOut'
        }
      },
      snap: false,
      swipe: false,
      onSwipe: $dtvCarousel.onSwipe.Page,
      onUpdate: false,
      animationEngine: 'js'
    };

    return {
      restrict: 'AE',
      scope: {
        id: '@',
        containerSelector: '@',
        options: '=?'
      },
      controller: 'dtvCarouselCtrl',
      link: link
    };
  }


  angular
    .module('dtvCarousel', [])
    .directive('dtvCarousel', dtvCarousel);

})(window.angular, window.Hammer, window.TweenMax);

