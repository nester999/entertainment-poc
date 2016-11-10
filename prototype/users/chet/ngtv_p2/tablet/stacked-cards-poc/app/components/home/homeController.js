'use strict';
(function(){
  var app = angular.module("NgtvP2", 
    [
      'angular-gestures'
    ]
  )
  .config(function (hammerDefaultOptsProvider) {
    hammerDefaultOptsProvider.set({
        recognizers: [
          [Hammer.Pinch, {threshold: 0}],
          [Hammer.Swipe, {threshold: 0}]
        ]
    });
  });

  app.filter('timeFormatting', function () {
    return function (timeFormatting) {
      var hours = parseInt(timeFormatting / 60);
      var minutes = timeFormatting % 60;
      var seconds = parseInt(minutes / 60);

      return hours + ":" + minutes + ":" + seconds;
    };
  });

  app.controller("homeController", function($scope, $http, $filter, $timeout, $document, $interval, $window){
    var windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        originalWindowWidth = windowWidth,
        originalWindowHeight = windowHeight,
        windowScaleHeight,
        i,
        j,
        row,
        column,
        timeout,
        adjustCategoryCardStack,
        headerHeight,
        originalCategoryStackHeight = 615,
        originalFontSize = 16,
        originalHeaderHeight = 187,
        fontSize,
        headerHeight,
        categoryGridHeight,
        fontScale,
        responsiveFont,
        offSetImageToXCenter,
        offSetImageToYCenter,
        flyInFontSize,
        originalWindowXScrollOffset,
        centerImageX,
        centerImageY,
        categoryItemWidth,
        categoryItemHeight,
        currentTargetXOffset,
        currentTargetYOffset,
        windowXScrollOffset,
        windowYScrollOffset,
        categoryStackContainerYOffset,
        centerTitleX,
        flyOutXDirection,
        flyOutYDirection,
        selectedElementXOffset,
        selectedElementYOffset,
        currentElement,
        currentElementXOffset,
        currentElementYOffset,
        singleCategegoryCardWidth,
        singleCategegoryCardHeight,
        originalCategoryCardWidth = 680,
        originalCategoryCardHeight = 470,
        fontScale,
        categoryCardHeight,
        categoryCardWidth,
        fontSizeSelected;

    $scope.categoryStackStyle = {};
    $scope.timoutForCategoryResize = 500;
    $scope.disableScrollbar = "inherit";
    $scope.categoryCardDisplayLimit = 4;
    $scope.viewType = '';
    $scope.headerResize = {};
    $scope.categoryScroller = {
      width: '',
      height: '',
      marginTop: ''
    };

    $scope.categoryStackResize = {
      fontSize: '',
      transition: '',
      zIndex: 1
    };

    $scope.categoryStyle = {
      transition: ''
    };

    $scope.categoryZoom = function ($event, category, viewType) {
        categoryItemWidth = $event.currentTarget.clientWidth * 2,
        categoryItemHeight = $event.currentTarget.clientHeight * 2,
        currentTargetXOffset = $event.currentTarget.closest('.category-items').offsetLeft,
        currentTargetYOffset = $event.currentTarget.closest('.category-items').offsetTop,
        windowXScrollOffset = $(window).scrollLeft(),
        windowYScrollOffset = $(window).scrollTop(),
        categoryStackContainerYOffset = parseInt($('.category-scroller').css('margin-top')),
        centerTitleX = ((windowWidth - 680) / 2) + windowXScrollOffset,
        flyOutXDirection,
        flyOutYDirection,
        selectedElementXOffset,
        selectedElementYOffset,
        currentElement,
        currentElementXOffset,
        currentElementYOffset,
        singleCategegoryCardWidth,
        singleCategegoryCardHeight,
        originalCategoryCardWidth = 680,
        originalCategoryCardHeight = 470,
        fontScale,
        categoryCardHeight,
        categoryCardWidth;

      $scope.timoutForCategoryResize = 2000;
      $scope.categoryStyle.transition = '1s';
      $scope.categoryStackResize.transition = '2s';
      $scope.selectedCategory = category;
      $scope.viewType = viewType;

      if($scope.resetCardStackView === 'grid-view') {
        resetCardStack(category);
        return false;
      }

      $scope.categoryScrollerContainer = {
        width: '42.5em'
      }

      if($scope.selectedCategory.disableClick) {
        return true;
      }

      $scope.selectedTitle = {
        title: category.name,
        style: {
          transition: '1s'
        }
      };
      $scope.selectedCategory.flyIn = {
        title : {}
      };

      if(!$scope.selectedCategory.focus) {
        $scope.selectedCategory.disableClick = true;
        $scope.selectedCategory.focus = true;
        setAnimationForEachCategoryCardStack();

      } else {
        $scope.selectedCategory.disableClick = true;
        $scope.disableScrollbar = "inherit";
        $scope.selectedCategory.flyIn.title = {
          opacity: 0
        };

        $timeout(function () {
          $scope.selectedCategory.focus = false;

          angular.forEach($scope.categoryItems, function (category) {

            category.focus = false;
            category.flyOut = false;
            category.flyOutDirection = '';
            category.flyOutDirection = '';
            category.display = 'block';

          });

          $scope.selectedCategory.flyIn.title = {
            left: 0,
            bottom: 0,
            opacity: 0
          };
          $scope.selectedCategory.disableClick = false;
          deselectCategory(category);

        },1000);
        selectedCategoryTitleFlyOutAnimation();
      }

    };

    function setAnimationForEachCategoryCardStack(viewType){
      angular.forEach($scope.categoryItems, function (category, index) {
        selectedElementXOffset = event.currentTarget.closest('.category-items').offsetLeft;
        selectedElementYOffset = event.currentTarget.closest('.category-items').offsetTop;
        currentElement = $('.category-items')[index];
        currentElementXOffset = currentElement.offsetLeft;
        currentElementYOffset = currentElement.offsetTop;
        timeout = 500;
        fontSize = 16;
        category.viewType = viewType;
        if(category.focus !== true) {
          category.flyOut = true;

          category.flyOutXDirection = setWhichXAxisCategoriesFlyOut();
          category.flyOutYDirection = setWhichYAxisCategoriesFlyOut();
          $timeout(function () {
            // category.display = 'none';
          }, 500);
        } else {
          $scope.selectedCategory.flyIn.title = {
            opacity: 0
          };
          findCenterXYAxis();
          selectedCategoryTitleFlyInAnimation();
          $scope.resetCardStackView = $scope.viewType;
          if($scope.viewType === 'grid-view') {
            selectedCategoryGridView(category);
          } else if ($scope.viewType === 'rolodex-view') {
            zoomInSelectedCategory(category.items);
          }
          category.zIndex = 100;
        }
      });
    };

    $scope.swipeNextCard = function(category) {
      var cardToRemove, singleCategegoryCardHeight, itemsLength;
      $scope.categoryStyle.transition = '.25s';
      // if(!$scope.disableCardStackSwipe) {
        // $scope.disableCardStackSwipe = true;
        singleCategegoryCardHeight = $('.list-item').outerHeight(true);
        itemsLength = category.items.length;
        cardToRemove = category.items[0];
        cardToRemove.flyIn = {
          bottom: -(singleCategegoryCardHeight/12) + 'px',
          opacity: 0,
          display: 'none'
        };
        $timeout(function () {
          category.items.splice(0,1);
          $timeout(function () {
            $scope.disableCardStackSwipe = false;
            category.items.splice(itemsLength, 0, cardToRemove);
            category.items[itemsLength - 1].flyIn = {};
          }, 100)
        }, 100);
      // };
    };

    $scope.swipePrevCard = function(category) {
      var cardToAdd, singleCategegoryCardHeight, itemsLength;
      $scope.categoryStyle.transition = '.25s';
      // if(!$scope.disableCardStackSwipe) {
        // $scope.disableCardStackSwipe = true;
        singleCategegoryCardHeight = $('.list-item').outerHeight(true);
        itemsLength = category.items.length - 1;
        cardToAdd = category.items[itemsLength];
        category.items.splice(itemsLength, 1);
        cardToAdd.flyIn = {
          bottom: -(singleCategegoryCardHeight/12) + 'px',
          opacity: 0,
          display: 'none'
        };
        category.items.splice(0, 0, cardToAdd);
        $timeout(function () {
          category.items[0].flyIn = {};
        //   $scope.disableCardStackSwipe = false;
        //   category.items.splice(itemsLength, 0, cardToAdd);
        }, 50)
      // };
    };


    function setWhichXAxisCategoriesFlyOut() {
      if(selectedElementXOffset === currentElementXOffset ) {
        return '';
      } else if(selectedElementXOffset > currentElementXOffset) {
        return 'left';
      } else {
        return 'right';
      }

    };

    function setWhichYAxisCategoriesFlyOut() {
      if (selectedElementYOffset === currentElementYOffset) {
        return '';
      } else if (selectedElementYOffset > currentElementYOffset) {
        return 'top';
      } else {
        return 'bottom';
      }
    };

    function selectedCategoryTitleFlyInAnimation() {
      fontSizeSelected = fontScale * 28;
      $scope.selectedTitle.style = {
        left: windowXScrollOffset + 'px',
        fontSize: fontSizeSelected + 'px',
        height: fontSizeSelected + 'px',
        display: 'block',
        transition: '1s',
        opacity: 0
      };
      $scope.selectedCategory.flyIn.title = {
        left: '0',
        bottom: 0,
        opacity: 0
      };
      $timeout(function() {
        $scope.selectedTitle.style.opacity = 1;
        $scope.selectedTitle.style.transition = '1s';
        $scope.selectedCategory.disableClick = false;
      }, 2000);
    };

    function selectedCategoryTitleFlyOutAnimation() {
      $scope.selectedTitle.style = {
        left: windowXScrollOffset + 'px',
        top: '0',
        fontSize: fontSizeSelected + 'px',
        width: 24.28 + 'em',
        opacity: 0,
        transition: '1s'
      };
      $timeout(function() {
        $scope.selectedCategory.flyIn.title = {
          bottom: 0,
          opacity: 1
        };
      }, 2000);
    };

    function disableScrollingAfterCategorySelected(category) {
      $timeout(function () {
        $scope.disableScrollbar = 'hidden';
        $scope.categoryStyle.transition = '0'
        $scope.selectedTitle.style.left = '0';
        $scope.selectedTitle.style.transition = '0';
        centerCategoryStackToScreen(category);
      }, 3000);
    };

    function deselectCategory(category) {
      var item, categorgyCardsZoomOut;
      timeout = 0;
      enableScrollingAfterCategoryDeselected(category);
      $timeout(function () {
        $scope.categoryStyle.transition = '1s';

        i = $scope.categoryCardDisplayLimit;
        categorgyCardsZoomOut = $interval(function () {
          if(i >= 0) {
            item = category.items[i];
            item.flyIn = {
              left: 0,
              bottom: 0
            };
          } else {
            $interval.cancel(categorgyCardsZoomOut);
            angular.forEach(category.items, function(item, key) {
              delete item.flyIn.left;
              delete item.flyIn.bottom;
              delete item.flyIn.width;
              delete item.flyIn.fontSize;
              delete item.flyIn.height;
              delete item.flyIn.margin;
            });
          }
          i--;
        }, 250)

      }, 250);

    };

    function enableScrollingAfterCategoryDeselected(category) {
      $scope.disableScrollbar = 'inherit';
      $scope.categoryStyle.transition = '0';
      $scope.selectedTitle.style.left =  offSetImageToXCenter + 'px';

      angular.forEach(category.items, function(item) {
        item.flyIn = {
          left: offSetImageToXCenter + 'px',
          bottom: offSetImageToYCenter + 'px',
          fontSize: flyInFontSize + 'px'
        };
      });
      window.scrollTo(originalWindowXScrollOffset, 0);
    };

    function detectLandscapeView() {
      if(windowWidth > windowHeight) {
        return true;
      } else {
        return false
      }
    };

    function findCenterXYAxis() {
      singleCategegoryCardHeight = categoryGridHeight * (3/4);
      singleCategegoryCardWidth = windowWidth * (3/4);
      originalWindowXScrollOffset = windowXScrollOffset;

      if( detectLandscapeView() ) {
        fontScale = singleCategegoryCardHeight / originalCategoryCardHeight;
        offSetImageToXCenter = ((windowWidth - categoryItemWidth) / 2 + windowXScrollOffset) - currentTargetXOffset;
        offSetImageToYCenter = -(windowHeight / 2) + currentTargetYOffset + categoryStackContainerYOffset;
      } else {
        fontScale = originalCategoryCardHeight / singleCategegoryCardWidth;
        categoryCardWidth = originalCategoryCardWidth * fontScale;
        categoryCardHeight = originalCategoryCardHeight * fontScale;
        offSetImageToXCenter = ((windowWidth - categoryCardWidth) / 2 ) + windowXScrollOffset - currentTargetXOffset;
        offSetImageToYCenter = -((windowHeight - categoryCardHeight) / 2 )  + currentTargetYOffset + categoryStackContainerYOffset;
      }
    };

    function centerCategoryStackToScreen(category) {
      centerImageX = offSetImageToXCenter - originalWindowXScrollOffset;
      centerImageY = offSetImageToYCenter;
      angular.forEach(category, function(item) {
        item.flyIn = {
          left: centerImageX + 'px',
          bottom: centerImageY + 'px',
          fontSize: flyInFontSize + 'px'
        };
      });
    };

    function selectedCategoryGridView(category) {
      category.displayLimit = category.items.length;
      $timeout(function () {
        row = 0;
        column = 0;

        currentTargetXOffset = $('.category-items.fly-in').offset().left - (parseFloat($scope.categoryStackResize.fontSize) * 3.125) - windowXScrollOffset ;
        currentTargetYOffset = $('.category-items.fly-in').offset().top - parseFloat($('.category-scroller').css('margin-top')) - $('.selected-category-title').outerHeight(true);

        $('body').css({
          "overflow-x": "hidden",
          "overflow-y": "auto"
        })
        $scope.categoryCardPosition = {
          left: 0,
          bottom: 0
        };
        category.style = {
          left: -currentTargetXOffset + 'px',
          bottom: currentTargetYOffset
        }

        categoryCardWidth = (($('.category-scroller').width() / 3) / parseFloat($scope.categoryStackResize.fontSize)) - 6.25 + 'em';
        categoryCardHeight = parseFloat(categoryCardWidth) * (470/680) + 'em';
        angular.forEach(category.items, function(item, key) {
          $scope.categoryCardPosition.left = ($('.category-scroller').width() / 3) * column;
          $scope.categoryCardPosition.bottom = (((parseFloat(categoryCardWidth) * (470/680)) + 3.125) * parseFloat($scope.categoryStackResize.fontSize)) * row;
          item.flyIn = {
            width: categoryCardWidth,
            height: categoryCardHeight,
            margin: '0',
            left: $scope.categoryCardPosition.left + 'px',
            bottom: -$scope.categoryCardPosition.bottom + 'px',
            containerWidth: '100%'
          };
          if(column < 2) {
            column++;
          } else {
            row++;
            column = 0;
          }
        });
      }, 1000);
      $timeout(function () {
        $scope.categoryScroller.height = ($('.category-scroller').width() / 3) * (470/680) * (row + 1);
      }, 1500);
      $timeout(function () {
        angular.forEach($scope.categoryItems, function (category) {
          if(!category.focus) {
            category.style = {
              visibility: "hidden"
            }
          }
        });
      }, 500);
    }

    function resetCardStack (category) {
      $('html, body').animate({scrollTop: 0});
      $scope.resetCardStackView = '';
      $scope.selectedCategory.focus = false;
      $scope.categoryStyle.transition = '1s';
      delete category.style;

      angular.forEach(category.items, function(item, key) {
        delete item.flyIn.left;
        delete item.flyIn.bottom;
        delete item.flyIn.width;
        delete item.flyIn.fontSize;
        delete item.flyIn.height;
        delete item.flyIn.margin;
      });

      $('body').css({
        "overflow-x": "auto",
        "overflow-y": "hidden"
      });

      angular.forEach($scope.categoryItems, function(category) {
        delete category.display;
        delete category.flyOut;
        delete category.flyOutXDirection;
        delete category.flyOutYDirection;
        delete category.margin;
        delete category.style;
      });
      $timeout(function () {
        category.displayLimit = 4;
      }, 1000);

      selectedCategoryTitleFlyOutAnimation();
      setCategorySliderWidth();
    };

    function zoomInSelectedCategory(category) {

      findCenterXYAxis();
      flyInFontSize = fontScale * originalFontSize;
      offSetImageToYCenter -= parseInt($scope.selectedTitle.style.fontSize) + parseInt($('.selected-category-title').css('margin-bottom'));

      timeout = 500;
      angular.forEach(category, function(item) {
        $timeout(function() {
          item.flyIn = {
            left: offSetImageToXCenter + 'px',
            bottom: offSetImageToYCenter + 'px',
            fontSize: flyInFontSize + 'px'
          };
        }, timeout);
        timeout += 200;
      });

      disableScrollingAfterCategorySelected(category);

    };

    function getCategoryItems(){
      $http.get("/_shared/ngtv2/data.json").success(function(data){
        $scope.categoryItems = data;
        $timeout(function (){
          calculateCategoryItemsSize();
        }, 500);
      });
    };

    function setCategorySliderWidth(){
      var categoryItemWidth = $('.category-items').outerWidth(true) + 1;
      var categoryItemsPerRow = $scope.categoryItems.length / 2;
      // $scope.categoryStyle.transition = '0';
      $scope.categoryStackResize.transition = '1s';
      $scope.timoutForCategoryResize = 1000;

      $scope.categoryScroller.width = categoryItemWidth * categoryItemsPerRow;
    };

    function calculateCategoryItemsSize () {
      headerHeight = parseInt($('.header').css('height'));
      categoryGridHeight = windowHeight - headerHeight,
      fontScale = (categoryGridHeight/2) / originalCategoryStackHeight,
      responsiveFont = (originalFontSize * fontScale) + 'px';

      $timeout(function () {
        setCategorySliderWidth();
      }, $scope.timoutForCategoryResize);

      $scope.categoryStackResize.fontSize = responsiveFont;
      $scope.categoryScroller.marginTop = headerHeight;
    };


    $(window).resize(function () {

      if(windowHeight !== $(window).height()) {
        $timeout.cancel(adjustCategoryCardStack);
        adjustCategoryCardStack = $timeout(function () {
          windowWidth = $(window).width(),
          windowHeight = $(window).height();
          headerHeight = parseInt($('.header').css('height'));
          categoryGridHeight = windowHeight - headerHeight;

          if(angular.isDefined($scope.selectedCategory) && $scope.selectedCategory.focus) {
            zoomInSelectedCategory($scope.selectedCategory.items);
          } else {
            $scope.categoryScroller.width = $(window).width() * 2;
            calculateCategoryItemsSize();
          }
        }, 250);
      }

    });

    getCategoryItems();

  });

})();
