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
            direction: Hammer.DIRECTION_VERTICAL
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
    }
  })

  var mc = new Hammer.Manager(document.body, {});
  mc.add(new Hammer.Pan({
    direction: Hammer.DIRECTION_VERTICAL,
    threshold: 0
  }));

  mc.add(new Hammer.Swipe({

  }));

  mc.on('swipeup', function() {
    alert('swipeup');
  });


  mc.on('panup', function(e) {
    $('img').on('dragstart', function(event) {
      event.preventDefault();
    });
  });



  mc.on('panend', function(e) {

  });

  mc.on("panmove", function(e) {
    // console.log('e: ' + JSON.stringify(e, null, 2));


    // if (e.direction === Hammer.DIRECTION_UP) {

    //   var angle = 180;
    // } else if (e.direction === Hammer.DIRECTION_DOWN) {

    // var s1 = Math.abs(e.velocityY * 4);
  });

  app.controller("StackedViewController", function($scope, $http, $filter, $timeout, $document) {
    var windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      spaceBetweenPosters = 70,
      zOffset = 200;

    $(window).resize(function() {
    });

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


    // console.log($('.movie-poster img'));

    // $timeout(function() {
    //   var p = $('.movie-poster img');
    //   var elem = angular.element(p[0])[0];
    //   elem.style.transform = 'translate3d(0px, ' + (100) + 'px, ' + (0) + 'px)';      
    //   console.log(p);
    // }, 1000);

    function setTransform(elem, y, z) {
      elem.style.transform = 'translateZ(' + z + 'px) translateY(' + y + 'px)';
      elem.style.transform = 'translateZ(' + z + 'px) translateY(' + y + 'px)';
    }




    // angular.element(p[0]).style.webkitTran



    // position cards along the function:
    // y = (5z^2 - 1100000) / (4.5z^2.7 + 20000) + 9
    // google the above line to see the profile line of the cards placed
    function getYAxisMotionPathValue(z) {
      return (5 * (Math.pow(z, 2) - 1100000)) / (4.5 * (Math.pow(z, 2.7) + 20000)) + 9;
    }

    function getZAxisMotionPathValue(y) {
      return Math.sqrt((((y - 9) * (4.5 * Math.pow(y, 2.7)) + 20000) + 1100000) / 5);
    }

    $scope.swipe = function(event) {
      alert(event);
    };

    // cards move along the given function curve based on the deltaY of the hm-drag-down
    $scope.scrollCardsDown = function(event) {
      $.fn.reverse = [].reverse;
      var posters = $('.movie-poster img').reverse();


      angular.forEach(posters, function(poster, index) {
        // if (!docked) {

        // get the transform value of the current poster in the stack
        var currentPosterStyle = poster.style;
        var currentPosterTransform = currentPosterStyle.transform;
        console.log('currentPosterTransform: ' + currentPosterTransform);
        var prevPosterTz;

        var Tz = currentPosterTransform.split('(')[1].split(')')[0];
        // console.log('Tz[' + index + '] ' + Tz);

        // lop of 'px' at the end of the value
        var currentTzDownValue = parseInt(Tz.substring(0, Tz.length - 2));
        // console.log('currentTzDownValue[' + index + '] ' + currentTzDownValue);


        // extract the translateX pixel value from the current element's transform
        var TyString = currentPosterTransform.split('(')[2].split(')')[0];
        // console.log('TyString[' + index + '] ' + TyString);

        // lop of 'px' at the end of the value
        var currentTyValue = parseInt(TyString.substring(0, TyString.length - 2));
        // console.log('currentTyValue[' + index + '] ' + currentTyValue);

        // new translateZ value is the current z-position plus the delta of the swipeUp, time the sensitivity of the swipe
        // console.log('event.deltaY: ' + event.deltaY);
        // console.log('event.velocityY: ' + event.velocityY);

        var newTzValue = parseInt(currentTzDownValue + (event.deltaY * Math.abs(event.velocityY)));
        // console.log('newTzValue: ' + newTzValue);
        // console.log('z difference: ' + (newTzValue + (currentTzDownValue - newTzValue)));

        var newTyValue = parseInt(currentTyValue + event.deltaY);

        // if(index === 0) {
        //   newTzValue *= 0.75;
        // }

        setTimeout(function() {



          if (newTzValue > $scope.zDropoffPoint && currentTzDownValue < $scope.zDropoffPoint ) {
            poster.style.transform = poster.style.transform = 'translateZ(' + (currentTzDownValue + (50 + 32*((posters.length - 1) - index)) * Math.abs($scope.velocityMultiplier * event.velocityY)) + 'px) translateY(' + (currentTyValue + $scope.yDropRate)* Math.abs($scope.velocityMultiplier * event.velocityY)+ 'px)';
          } 
          else if (currentTzDownValue >= $scope.zDropoffPoint) {
            // console.log('stepping over stack');
            poster.style.transform = poster.style.transform = 'translateZ(' + (200 - (index * $scope.slowZoneSpacer)) + 'px) translateY(' + (currentTyValue + $scope.yDropRate)* Math.abs($scope.velocityMultiplier * event.velocityY) + 'px)';
          }
          else if (currentTyValue < -100 || newTyValue < -200) {
            poster.style.transform = poster.style.transform = 'translateZ(' + ($scope.frontOfStack) + 'px) translateY(' + -3000 + 'px)';

          }
          else {
            // console.log(poster.alt + ', poster[' + index + '].transform: ' + 'translateZ(' + newTzValue + 'px) translateY(' + $scope.translateYTrack + 'px)');
            poster.style.transform = poster.style.transform = 'translateZ(' + (currentTzDownValue + (50 + 32*((posters.length - 1) - index)) * Math.abs($scope.velocityMultiplier * event.velocityY)) + 'px) translateY(' + $scope.translateYTrack + 'px)';
          }

        }, (5 * index));
      });
    };

    $scope.scrollCardsUp = function(event) {
      console.log("scrollCardsUp: "); //, JSON.stringify(event, null, 2));
      $('#horizon').css('color', 'red');
      var deltaY = event.deltaY;
      var ctr = 0;
      var zOffset = 300;
      var previousPosterZPosition = 0;
      var docked = false;

      var posters = $('.movie-poster img');

      angular.forEach(posters, function(poster, index) {


        // get the transform value of the current poster in the stack
        var currentPosterStyle = poster.style;
        var currentPosterTransform = currentPosterStyle.transform;
        var prevPosterTz;

        // get the z-position of the previous card in the stack for comparison later
        if (index > 0) {
          prevPosterTz = posters[index - 1].style.transform.split('(')[1].split(')')[0];
          prevPosterTz = parseInt(prevPosterTz.substring(0, prevPosterTz.length - 2));
        }

        // extract the translateZ pixel value from the current card's transform
        var TzString = currentPosterTransform.split('(')[1].split(')')[0];

        // lop of 'px' at the end of the value
        var currentTzValue = parseInt(TzString.substring(0, TzString.length - 2));

        // extract the translateX pixel value from the current element's transform
        var TyString = currentPosterTransform.split('(')[2].split(')')[0];

        // lop of 'px' at the end of the value
        var currentTyValue = parseInt(TyString.substring(0, TyString.length - 2));

        // new translateZ value is the current z-position plus the delta of the swipeUp, time the sensitivity of the swipe
        var newTzValue = parseInt(currentTzValue + (event.deltaY * $scope.swipeUpSensitivity));

        // slowdown zone is the area when you swipe the stack all the way up and they collect at the top
        // cards are spaced evenly by their index * slowZoneSpacer 
        var slowdownZone = newTzValue - ($scope.backStop + (index * $scope.slowZoneSpacer));


        if ((prevPosterTz + currentTzValue) === $scope.slowZoneSpacer) {
          if (index === (posters.length - 1)) {
            currentTzValue += ($scope.backStop + (index * $scope.slowZoneSpacer));
          } else {
            newTzValue = newTzValue - slowdownZone;
            docked = true;
          }
        }

        // handles first index not having previous poster
        if (index === 0) {
          if (currentTzValue < ($scope.backStop + (index * $scope.slowZoneSpacer))) {
            currentTzValue += currentTzValue % ($scope.backStop + (index * $scope.slowZoneSpacer));
            // console.log('LAST INDEX AT END');
            docked = true;
          }
        }

        setTimeout(function() {
          if (!docked) {
            // if card is close to the backStop of the stack, ease into the back position
            if (currentTzValue >= ($scope.backStop + (index * $scope.slowZoneSpacer)) && newTzValue > ($scope.backStop + index)) {
              // console.log(poster.alt + ', poster[' + index + '].transform: ' + 'translateZ(' + newTzValue*(2*event.velocityY) + 'px) translateY(' + $scope.translateYTrack + 'px)');
              poster.style.transform = poster.style.transform = 'translateZ(' + newTzValue + 'px) translateY(' + $scope.translateYTrack + 'px)';
              // poster.style.transform = 'translateZ(' + newTzValue + 'px) translateY(' + $scope.translateYTrack + 'px)';
            } 
            // cards that are popping back up into view
            else if (currentTzValue > $scope.zDropoffPoint) {
              poster.style.transform = poster.style.transform = 'translateZ(' + ($scope.backStop + (index * $scope.slowZoneSpacer)) + 'px) translateY(' + (currentTyValue - $scope.yDropRate)* Math.abs(event.velocityY) + 'px)';
            } 

            else {
              // console.log(poster.alt + ', poster[' + index + '].transform: ' + 'translateZ(' + newTzValue + 'px) translateY(' + $scope.translateYTrack + 'px)');
              poster.style.transform = poster.style.transform = 'translateZ(' + ($scope.backStop + (index * $scope.slowZoneSpacer)) + 'px) translateY(' + $scope.translateYTrack + 'px)';
            }
          }
        }, (20 * index));
      });
    };

    $scope.stack = {
      perspOriginX: 50,
      perspOriginY: 200,
      style: {},
    };


    $scope.movieLinks = [{
      "imgPath": "assets/img/cards/movies/big-hero-6.jpg",
      "title": "Big Hero 6",
      "style": {
        "transform": "translateZ(" + ((0 * spaceBetweenPosters) - zOffset) + "px) translateY(" + 0 + "px)", //can't do motionPathValue because it's infinity at 0

        "z-index": "10"
      }
    }, {
      "imgPath": "assets/img/cards/movies/avengers-age-of-ultron.jpg",
      "title": "Avengers",
      "style": {
        "transform": "translateZ(" + (1 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisMotionPathValue(1 * spaceBetweenPosters) + "px)",
        "z-index": "11"
      }
    }, {
      "imgPath": "assets/img/cards/movies/chappie.jpg",
      "title": "Chappie",
      "style": {
        "transform": "translateZ(" + (2 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisMotionPathValue(2 * spaceBetweenPosters) + "px)",
        "z-index": "12"
      }
    }, {
      "imgPath": "assets/img/cards/movies/mad-max-fury-road.jpg",
      "title": "Mad Max",
      "style": {
        "transform": "translateZ(" + (3 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisMotionPathValue(3 * spaceBetweenPosters) + "px)",
        "z-index": "13"
      }
    }, {
      "imgPath": "assets/img/cards/movies/san-andreas.jpg",
      "title": "San Andreas",
      "style": {
        "transform": "translateZ(" + (4 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisMotionPathValue(4 * spaceBetweenPosters) + "px)",
        "z-index": "14"
      }
    }, {
      "imgPath": "assets/img/cards/movies/the-thing.jpg",
      "title": "The Thing",
      "style": {
        "transform": "translateZ(" + (5 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisMotionPathValue(5 * spaceBetweenPosters) + "px)",
        "z-index": "16"
      }
    }, {
      "imgPath": "assets/img/cards/movies/tomorrowland.jpg",
      "title": "Tomorrowland",
      "style": {
        "transform": "translateZ(" + (6 * spaceBetweenPosters - zOffset) + "px) translateY(" + getYAxisMotionPathValue(6 * spaceBetweenPosters) + "px)",
        "z-index": "17"
      }
    }, ];


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
