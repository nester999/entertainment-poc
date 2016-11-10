var app = angular.module('app', ['dtvCarousel']);

app.controller('AppCtrl', ['$scope', '$dtvCarousel',
  function($scope, $dtvCarousel) {
    $scope.items = [];
    $scope.currentIndex = 0;

    // Values used for ledgend
    var j = 0;
    var k = 0;


    $scope.addItem = function() {
      $scope.items.push({ slideIndex: $scope.items.length, pageIndex: j });

      if(k === 3) {
        j++;
        k = 0;
      } else {
        k++;
      }
    };

    // Add items
    for(var i = 0; i < 12; i++) {
      $scope.addItem();
    }


    $scope.removeItem = function() {
      $scope.items.pop();
      j--;
      k--;
    };


    $scope.indexChanged = function() {
      $scope.currentIndex = Carousel.toIndex($scope.currentIndex);
    };


    //////////////
    // Carousel //
    //////////////


    $scope.carouselOptions = {
      tweenOptions: {
        slide: {
          duration: 0.75,
          ease: 'Power3.easeOut'
        },
        page: {
          duration: 1.1,
          ease: 'Power3.easeOut'
        },
        snap: {
          duration: 0.80,
          ease: 'Power3.easeOut'
        },
      },
      snap: false,
      swipe: false,
      onUpdate: false,

      // If changing cs css dont forget to uncomment transition in stylesheet
      animationEngine: 'js'
    };


    $scope.carouselOptions2 = {
      tweenOptions: {
        slide: {
          duration: 0.75,
          ease: 'Power3.easeOut'
        },
        page: {
          duration: 1.1,
          ease: 'Power3.easeOut'
        },
        snap: {
          duration: 0.80,
          ease: 'Power3.easeOut'
        },
      },
      snap: false,
      swipe: false,
      onSwipe: $dtvCarousel.onSwipe.Page,
      onUpdate: false,

      // If changing cs css dont forget to uncomment transition in stylesheet
      animationEngine: 'js'
    };

    $scope.carouselOptions3 = {
      tweenOptions: {
        slide: {
          duration: 0.75,
          ease: 'Power3.easeOut'
        },
        page: {
          duration: 1.1,
          ease: 'Power3.easeOut'
        },
        snap: {
          duration: 0.80,
          ease: 'Power3.easeOut'
        },
      },
      snap: false,
      onSwipe: $dtvCarousel.onSwipe.Slide,
      onUpdate: false,

      // If changing cs css dont forget to uncomment transition in stylesheet
      animationEngine: 'js'
    };


    var Carousel;

    $dtvCarousel.get('wassup').then(function(carousel) {
      Carousel = carousel;
      Carousel.onSlideChanged(slideChanged);
    });


    function slideChanged(slideIndex) {
      $scope.currentIndex = slideIndex;
    }


    $scope.$on('$destroy', function() {
      Carousel.unbindSlideChanged(slideChanged);
      Carousel = null;
    });

  }
]);

