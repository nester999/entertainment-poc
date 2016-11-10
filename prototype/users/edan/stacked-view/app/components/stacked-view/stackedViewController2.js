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
            direction: Hammer.DIRECTION_HORIZONTAL
          }],
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

  mc.on('panstart', function(e) {
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
      zOffset = 200,
      posterAtFrontClientY = 0.75 * windowWidth,
      alreadyFiringEvent = false;
    $('#horizon').text(posterAtFrontClientY);
    $('.horizon-line').css('top', posterAtFrontClientY + 'px');

    $(window).resize(function() {
      posterAtFrontClientY = 0.75 * $(window).height();
      $("#horizon").text(posterAtFrontClientY);
      $('.horizon-line').css('top', '0.75%');
    });

    $scope.disableScrollbar = false;

    // position cards along the function:
    // y = (5z^2 - 1100000) / (4.5z^2.7 + 20000) + 9
    // google the above line to see the profile line of the cards placed
    function getYAxisMotionPathValue(z) {
      return (5 * (Math.pow(z, 2) - 1100000)) / (4.5 * (Math.pow(z, 2.7) + 20000)) + 9;
    }

    function getZAxisMotionPathValue(y) {
      return Math.sqrt((((y - 9) * (4.5 * Math.pow(y, 2.7)) + 20000) + 1100000) / 5);
    }

    $scope.myExpandCards = function(event) {
      if (!alreadyFiringEvent) {
        alreadyFiringEvent = true;
        event.preventDefault();
        var originalTranslateZ = $('.movie-poster img').first();

        // alert(JSON.stringify(event, null, 2));
        var posters = $('.movie-poster img').first();
        // console.log(posters);
        var matrix = posters.css('translate');
        var ctr = 0;
        angular.forEach($scope.movieLinks, function(movieLink, index) {

          if (!(movieLink.style.transform === 'translateZ(' + (originalTranslateZ + event.deltaY) + 'px) translateY(0px)') && (movieLink.style !== originalTranslateZ.style)) {
            movieLink.style.transform = 'translateZ(' + ((ctr * spaceBetweenPosters) - zOffset) + 'px) translateY(' + (index === 0 ? 0 : getYAxisMotionPathValue(ctr * spaceBetweenPosters)) + 'px)';
            ctr++;
          }
          // else {
          //   movieLink.style.transform = 'translateZ(' + (originalTranslateZ + event.deltaY) + 'px)';
          // }
        });
      }
      alreadyFiringEvent = false;
    };

    // cards move along the given function curve based on the deltaY of the hm-drag-down
    $scope.scrollCardsDown = function(event) {
      var deltaY = event.deltaY;

      angular.forEach($scope.movieLinks, function(movieLink, index) {

        if (!(movieLink.style.transform === 'translateZ(' + (originalTranslateZ + event.deltaY) + 'px) translateY(0px)') && (movieLink.style !== originalTranslateZ.style)) {
          movieLink.style.transform = 'translateZ(' + ((ctr * spaceBetweenPosters) - zOffset) + 'px) translateY(' + (index === 0 ? 0 : getYAxisMotionPathValue(ctr * spaceBetweenPosters)) + 'px)';
          ctr++;
        }
        // else {
        //   movieLink.style.transform = 'translateZ(' + (originalTranslateZ + event.deltaY) + 'px)';
        // }
      });
    };

    $scope.myCollapseCards = function(event) {
      if (!alreadyFiringEvent) {
        alreadyFiringEvent = true;
        event.preventDefault();
        var originalTranslateZ = $('.movie-poster img').first();

        // alert(JSON.stringify(event, null, 2));
        var posters = $('.movie-poster img').first();
        // console.log(posters);
        var matrix = posters.css('translate');
        // console.log('Matrix', matrix);
        var ctr = 0;
        angular.forEach($scope.movieLinks, function(movieLink) {
          // if((movieLink.style.transform === 'translateZ(' + (originalTranslateZ + event.deltaY) + 'px)')) {
          // movieLink.style.transform = 'translateZ(' + ((ctr * spaceBetweenPosters) - zOffset) + 'px) translateY(' + getYAxisMotionPathValue(ctr * spaceBetweenPosters) + 'px)';
          // ctr++;
          // }
          // else {
          // console.log(JSON.stringify(movieLink.style.transform, null, 2));
          // console.log('e vent.deltaY: ', event.deltaY);

          // alert('ogTz: ' + originalTranslateZ[0].attributes.style);
          // var justTz =  toString(originalTranslateZ[0].attributes.style);
          // console.log( 'typeof justTz ' + typeof justTz);
          // justTz = jus tTz.split('(');
          // var daTransl ateZ = justTz[1].split(')');

          // console.log( 'daTranslateZ: ' + daTranslateZ);
          var posterTranslateZ = movieLink.style.transform;

          movieLink.style.transform = 'translateZ(' + (originalTranslateZ + event.deltaY) + 'px)';
          // }
        });
      }
      alreadyFiringEvent = false;
    };


    $scope.mySwipeLeft = function(event) {
      alert(JSON.stringify(event, null, 2));
      var originalTranslateZ = $('.movie-poster img').first();

      // alert(JSON.stringify(event, null, 2));
      var posters = $('.movie-poster img').first();
      // console.log(posters);
      var matrix = posters.css('translate');
      var ctr = 0;
      angular.forEach($scope.movieLinks, function(movieLink) {
        // if((movieLink.style.transform === 'translateZ(' + (originalTranslateZ + event.deltaY) + 'px)')) {
        // movieLink.style.transform = 'translateZ(' + ((ctr * spaceBetweenPosters) - zOffset) + 'px) translateY(' + getYAxisMotionPathValue(ctr * spaceBetweenPosters) + 'px)';
        // ctr++;
        // }
        // else {
        movieLink.style.transform = 'translateZ(' + (originalTranslateZ + event.deltaY) + 'px)';
        // }
      });
    };



    $scope.stack = {
      perspOriginX: 50,
      perspOriginY: 200,
      style: {},
    };

    $scope.calcStyle = function(stack) {
      stack.style = {
        'perspective-origin': stack.perspOriginX + '% ' + stack.perspOriginY + '%'
      };
    };

    $scope.style = function(stack) {
      return stack.style;
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
      },
      // "assets/img/cards/movies/avengers-age-of-ultron.jpg": "Avengers",
      // "assets/img/cards/movies/chappie.jpg": "Chappie",
      // "assets/img/cards/movies/mad-max-fury-road.jpg": "Mad Max",
      // "assets/img/cards/movies/san-andreas.jpg": "San Andreas",
      // "assets/img/cards/movies/tomorrowland.jpg": "Tomorrowland",
      // "assets/img/cards/movies/the-thing.jpg": "The Thing"
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
