'use strict';
(function() {
  var app = angular.module("NgtvPhase2", ['angular-gestures'])
    .config(function(hammerDefaultOptsProvider) {
      hammerDefaultOptsProvider.set({
        recognizers: [
          [Hammer.Pan, {
            time: 250
          }],
          [Hammer.Swipe, {
            threshold: 0
          }],
          [Hammer.Tap, {
            time: 250
          }]
        ]
      });
    });

  app.filter('timeFormatting', function() {
    return function(timeFormatting) {
      var hours = parseInt(timeFormatting / 60);
      var minutes = timeFormatting % 60;
      var seconds = parseInt(minutes / 60);

      return hours + ":" + minutes + ":" + seconds;
    };
  });

  app.controller("StackedViewController", function($scope, $http, $filter, $timeout, $document) {
    var windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      spaceBetweenPosters = 70,

      // push cards back away from camera
      zOffset = 500;

    $(window).resize(function() {});

    $scope.disableScrollbar = false;
    $scope.swipeUpSensitivity = 0.9;
    $scope.swipeDownSensitivity = 0.003;

    $scope.zDropoffPoint = 0;
    $scope.yDropRate = 300;
    $scope.backStop = -1200;
    $scope.frontOfStack = 700;
    $scope.translateYTrack = 8;
    $scope.slowZoneSpacer = 20;
    $scope.velocityMultiplier = 1;
    $scope.gravity = 0.1;
    $scope.deltaY = 0;

    var currentPos = 0;
    var rando = 1;
    $scope.velocity = 0;


    angular.element(document).ready(function() {
      $scope.$apply(function() {
        var cards = angular.element($('.movie-poster'));
        var ctr = 0;


        $.each(cards, function(index, card) {
          TweenMax.fromTo(card, 1, {
            opacity: 0,
            y: 0 + (index + 1) * 5,
            z: -100,
            scale: 0,
            rotationX: -360
          }, {
            y: 250 + (index + 1) * 10,
            z: -200 + (index + 1) * 40 * (1 + ((index + 1) / 12)),
            scale: 1,
            rotationX: 0,
            opacity: 1,
            delay: 1.5 + (index + 1) * 0.05,
            ease: Power3.easeOut
          });
          console.log(card.style.transform);
        });
        // TweenMax.staggerFromTo($('.movie-poster'), 0.7, { rotationX:-360, opacity: 1, y: 400}, {delay: 2, rotationX:0, scale: 1, opacity: 1, y: 300, ease: Power3.easeOut }, 0.1);




        animate();
      });
    });

    var container = document.getElementById('stacked-view-container');

    function animate() {

      var cards = angular.element($('.movie-poster img'));
      while ($scope.velocity !== 0) {
        $.each(cards, function(index, card) {


          var currentPosterTransform = card.style.transform || card.style.webkitTransform;
          // console.log('currentPosterStyle: ' + currentPosterTransform);




          var curTy = currentPosterTransform.split('px')[1];
          curTy = curTy.substring(2, curTy.length);
          // console.log('curTy: ' + curTy);

          var curTz = currentPosterTransform.split('px')[2];
          curTz = curTz.substring(2, curTz.length);
          // console.log('curTz: ' + curTz);


          // console.log('current velocity: ' + $scope.velocity);



          // setTimeout(function() {
          var direction;
          if ($scope.velocity < 0) {
            direction = -1;
          } else
            direction = 1;

          $scope.gravity += (0.01 * direction);

          var newTy = parseFloat(curTy) + parseFloat(0);
          var newTz = parseFloat(curTz) + parseFloat(-20 * $scope.velocity);
          // card.style.transform = 'translateZ(' + newTz + ') translateY(' + newTy + 'px)';
          card.style.transform = 'translate3d(0px, ' + newTy + 'px, ' + newTz + 'px)';
          card.style.webkitTransform = 'translate3d(0px, ' + newTy + 'px, ' + newTz + 'px)';

          if(newTz + 500 < -20)
            card.style.opacity = Math.abs(1 - (-20/(newTz + 500)));
          console.log(1-(20/(newTz + 500)));
          // console.log('updated transform: ' + card.style.transform);
          // card.style.transform = 'translateZ(' + (currentTzDownValue + (50 + 32 * ((posters.length - 1) - index)) * Math.abs($scope.velocityMultiplier * $scope.velocity)) + 'px)';


          // if (newTzValue > $scope.zDropoffPoint && currentTzDownValue < $scope.zDropoffPoint ) {
          //   poster.style.transform = poster.style.transform = 'translateZ(' + (currentTzDownValue + (50 + 32*((posters.length - 1) - index)) * Math.abs($scope.velocityMultiplier * event.velocityY)) + 'px) translateY(' + (currentTyValue + $scope.yDropRate)* Math.abs($scope.velocityMultiplier * event.velocityY)+ 'px)';
          // } 
          // else if (currentTzDownValue >= $scope.zDropoffPoint) {
          //   // console.log('stepping over stack');
          //   poster.style.transform = poster.style.transform = 'translateZ(' + (200 - (index * $scope.slowZoneSpacer)) + 'px) translateY(' + (currentTyValue + $scope.yDropRate)* Math.abs($scope.velocityMultiplier * event.velocityY) + 'px)';
          // }
          // else if (currentTyValue < -100 || newTyValue < -200) {
          //   poster.style.transform = poster.style.transform = 'translateZ(' + ($scope.frontOfStack) + 'px) translateY(' + -3000 + 'px)';

          // }
          // else {
          //   // console.log(poster.alt + ', poster[' + index + '].transform: ' + 'translateZ(' + newTzValue + 'px) translateY(' + $scope.translateYTrack + 'px)');
          //   poster.style.transform = poster.style.transform = 'translateZ(' + (currentTzDownValue + (50 + 32*((posters.length - 1) - index)) * Math.abs($scope.velocityMultiplier * event.velocityY)) + 'px) translateY(' + $scope.translateYTrack + 'px)';
          // }

          // }, (5 * index));


          if (Math.abs($scope.velocity) < 0.1)
            $scope.velocity = 0;
          else
            $scope.velocity *= 0.9;

        });
      }


      requestAnimationFrame(animate);
    }

    animate();




    // $timeout(function() {
    //   var p = $('.movie-poster img');
    //   var elem = angular.element(p[0])[0];
    //   elem.style.transform = 'translate3d(0px, ' + (100) + 'px, ' + (0) + 'px)';      
    //   console.log(p);
    // }, 1000);

    function setTransform(elem, y, z) {
      // elem.style.transform = 'translateZ(' + z + 'px) translateY(' + y + 'px)';
      // elem.style.transform = 'translateZ(' + z + 'px) translateY(' + y + 'px)';
    }





    // angular.element(p[0]).style.webkitTran



    // position cards along the function:
    // y = (5z^2 - 1100000) / (4.5z^2.7 + 20000) + 9
    // google the above line to see the profile line of the cards placed
    function getYAxisValue(z) {
      return (5 * (Math.pow(z, 2) - 1100000)) / (4.5 * (Math.pow(z, 2.7) + 20000)) + 9;
    }

    function getZAxisValue(y) {
      return Math.sqrt((((y - 9) * (4.5 * Math.pow(y, 2.7)) + 20000) + 1100000) / 5);
    }



    $scope.drag = function(event) {
      $scope.deltaY = event.deltaY;

    }

    $scope.swipe = function(event) {
      console.log('tap: ', event);
      $('.category-title').css('color', "#000");
    };

    // cards move along the given function curve based on the deltaY of the hm-drag-down
    $scope.scrollCardsDown = function(event) {
      $scope.velocity = event.velocityY;
      $scope.deltaY = event.deltaY;
      $('.category-title').css('color', '#F00');
    };

    $scope.scrollCardsUp = function(event) {
      $scope.velocity = event.velocityY;
      $scope.deltaY = event.deltaY;
    };

    $scope.stack = {
      perspOriginX: 50,
      perspOriginY: 200,
      style: {},
    };


    $scope.movieLinks = [
      // {
      //   "imgPath": "assets/img/cards/movies/big-hero-6.jpg",
      //   "title": "Big Hero 6",
      //   "style": {
      //     "transform": "translateZ(" + ((0 * spaceBetweenPosters) - zOffset) + "px) translateY(" + 0 + "px)", //can't do motionPathValue because it's infinity at 0
      //     "opacity": "0",
      //     "z-index": "10"
      //   }
      // }, 
      {
        "imgPath": "assets/img/cards/movies/avengers-age-of-ultron.jpg",
        "title": "Avengers",
        "style": {
          // "transform": "translateZ(" + (1 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisValue(1 * spaceBetweenPosters) + "px)",
          "transform": "translate3d(0px, " + getYAxisValue(1 * spaceBetweenPosters) + "px, " + (1 * spaceBetweenPosters - zOffset) + "px)",
          "opacity": "0",
          "z-index": "11"
        }
      }, {
        "imgPath": "assets/img/cards/movies/chappie.jpg",
        "title": "Chappie",
        "style": {
          "transform": "translate3d(0px, " + getYAxisValue(2 * spaceBetweenPosters) + "px, " + (2 * spaceBetweenPosters - zOffset) + "px)",
          // "transform": "translateZ(" + (2 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisValue(2 * spaceBetweenPosters) + "px)",
          "opacity": "0",
          "z-index": "12"
        }
      }, {
        "imgPath": "assets/img/cards/movies/mad-max-fury-road.jpg",
        "title": "Mad Max",
        "style": {
          "transform": "translate3d(0px, " + getYAxisValue(3 * spaceBetweenPosters) + "px, " + (3 * spaceBetweenPosters - zOffset) + "px)",
          // "transform": "translateZ(" + (3 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisValue(3 * spaceBetweenPosters) + "px)",
          "opacity": "0",
          "z-index": "13"
        }
      }, {
        "imgPath": "assets/img/cards/movies/san-andreas.jpg",
        "title": "San Andreas",
        "style": {
          "transform": "translate3d(0px, " + getYAxisValue(4 * spaceBetweenPosters) + "px, " + (4 * spaceBetweenPosters - zOffset) + "px)",
          // "transform": "translateZ(" + (4 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisValue(4 * spaceBetweenPosters) + "px)",
          "opacity": "0",
          "z-index": "14"
        }
      }, {
        "imgPath": "assets/img/cards/movies/the-thing.jpg",
        "title": "The Thing",
        "style": {
          "transform": "translate3d(0px, " + getYAxisValue(5 * spaceBetweenPosters) + "px, " + (5 * spaceBetweenPosters - zOffset) + "px)",
          // "transform": "translateZ(" + (5 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisValue(5 * spaceBetweenPosters) + "px)",
          "opacity": "0",
          "z-index": "16"
        }
      }, {
        "imgPath": "assets/img/cards/movies/tomorrowland.jpg",
        "title": "Tomorrowland",
        "style": {
          "transform": "translate3d(0px, " + getYAxisValue(6 * spaceBetweenPosters) + "px, " + (6 * spaceBetweenPosters - zOffset) + "px)",
          // "transform": "translateZ(" + (6 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisValue(6 * spaceBetweenPosters) + "px)",
          "opacity": "0",
          "z-index": "17"
        }
      },
    ];


    $scope.categoryZoom = function($event, category) {
      var categoryItemWidth = $event.currentTarget.clientWidth,
        categoryItemHeight = $event.currentTarget.clientHeight,
        currentTargetXOffset = $event.currentTarget.offsetLeft,
        currentTargetYOffset = $event.currentTarget.offsetTop,
        windowXScrollOffset = $(window).scrollLeft(),
        windowYScrollOffset = $(window).scrollTop(),
        offSetImageToXCenter = ((windowWidth - categoryItemWidth) / 2 + windowXScrollOffset) - currentTargetXOffset,
        offSetImageToYCenter = -((windowHeight - categoryItemHeight) / 2 + windowYScrollOffset) + currentTargetYOffset,
        timeout,
        flyOutXDirection,
        flyOutYDirection,
        selectedElementXOffset,
        selectedElementYOffset,
        currentElement,
        currentElementXOffset,
        currentElementYOffset;

      $scope.selectedCategory = category;
      $scope.selectedCategory.flyIn = '';

      if (!$scope.selectedCategory.focus) {
        $scope.selectedCategory.focus = true;
        $scope.disableScrollbar = true;
        $scope.selectedCategory.displayCount = 10;

        angular.forEach($scope.categoryItems, function(category, index) {
          selectedElementXOffset = event.currentTarget.offsetLeft;
          selectedElementYOffset = event.currentTarget.offsetTop;
          currentElement = $('.category-items')[index];
          currentElementXOffset = currentElement.offsetLeft;
          currentElementYOffset = currentElement.offsetTop;
          timeout = 500;
          if (category.focus !== true) {
            category.flyOut = true;
            if (selectedElementXOffset === currentElementXOffset) {
              flyOutXDirection = '';
            } else if (selectedElementXOffset > currentElementXOffset) {
              flyOutXDirection = 'left';
            } else {
              flyOutXDirection = 'right';
            }

            if (selectedElementYOffset === currentElementYOffset) {
              flyOutYDirection = '';
            } else if (selectedElementYOffset > currentElementYOffset) {
              flyOutYDirection = 'top';
            } else {
              flyOutYDirection = 'bottom';
            }
            category.flyOutXDirection = flyOutXDirection;
            category.flyOutYDirection = flyOutYDirection;
          } else {
            $scope.selectedCategory.flyIn = {
              opacity: 0
            }
            angular.forEach(category.items, function(item) {
              $timeout(function() {
                item.flyIn = {
                  left: offSetImageToXCenter + 'px',
                  bottom: offSetImageToYCenter + 'px'
                }
              }, timeout);
              timeout += 200;
            });
            $timeout(function() {
              $scope.selectedCategory.flyIn = {
                left: offSetImageToXCenter + 'px',
                bottom: offSetImageToYCenter + 50 + 'px',
                opacity: 0
              }
            }, 1000);
            $timeout(function() {
              $scope.selectedCategory.flyIn = {
                left: offSetImageToXCenter + 'px',
                bottom: offSetImageToYCenter + 'px',
                opacity: 1
              }
            }, 2000);
          }
        }, this);
      } else {
        $scope.selectedCategory.focus = false;
        $scope.disableScrollbar = false;
        $scope.selectedCategory.flyIn = "";
        angular.forEach($scope.categoryItems, function(category) {
          timeout = 0;

          $scope.selectedCategory.flyIn = {
            left: offSetImageToXCenter + 'px',
            bottom: offSetImageToYCenter + 50 + 'px',
            opacity: 0
          }

          $timeout(function() {
            $scope.selectedCategory.flyIn = {
              left: 0,
              bottom: 0,
              opacity: 0
            }
          }, 1000);
          $timeout(function() {
            $scope.selectedCategory.flyIn = {
              left: 0,
              bottom: 0,
              opacity: 1
            }
          }, 2000);

          category.focus = false;
          category.flyOut = false;
          category.flyOutDirection = "";
          angular.forEach(category.items, function(item) {
            $timeout(function() {
              item.flyIn = {
                left: 0,
                bottom: 0
              }
            }, timeout);
            timeout += 200;
          });
        });

      }
    }

    function getCategoryItems() {
      $http.get("/_shared/ngtv2/data.json").success(function(data) {
        $scope.categoryItems = data;
        setCategorySliderWidth();
      });
    }

    function setCategorySliderWidth() {
      var categoryItemWidth = windowWidth / 2.5;
      var categoryItemsPerRow = $scope.categoryItems.length / 2;
      $scope.categoryScrollerWidth = categoryItemWidth * categoryItemsPerRow;
    }

    getCategoryItems();

  });

})();
