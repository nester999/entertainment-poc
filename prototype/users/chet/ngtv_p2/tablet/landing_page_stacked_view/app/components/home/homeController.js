'use strict';
(function(){
  var app = angular.module("NgtvP2", ['angular-gestures'])
  .config(function (hammerDefaultOptsProvider) {
    hammerDefaultOptsProvider.set({
        recognizers: [
          [Hammer.Pinch, {threshold: 0}],
          [Hammer.Swipe, {threshold: 0}],
          [Hammer.Pan, {threshold: 0}]
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
    var topNavHeight,
    windowWidth,
    windowHeight,
    categoryCards,
    cardStackContainerWidth,
    cardStackWidth,
    cardStackHeight,
    cardStackLength,
    cardStackMargin,
    cardStackScale,
    cardStackTitleHeight,
    originalCardStackTitleHeight = 50,
    originalCardStackMargin = 50,
    originalCardStackMarginEm = 3.125,
    originalCardWidth = 680,
    originalCardHeight = 470,
    originalCardWidthEm = 42.5,
    originalCardHeightEm = 29.375,
    originalCardStackHeight = 561,
    originalFontSize = 16,
    singleCardWidth,
    singleCardHeight,
    fontSize,
    removeCardInStackCard,
    addCardInStackCard,
    currentDeltaY,
    reCalculateCardSize,
    adjustCardOpacity,
    isPanningUp,
    isPanningDown;

    function detectLandscapeView() {
      if(windowWidth > windowHeight) {
        return true;
      } else {
        return false
      }
    };

    function getCategoryItems(){
      $http.get("/_shared/ngtv2/data.json").success(function(data){
        $scope.categoriesList = data;
        cardStackLength = $scope.categoriesList.length;

        angular.forEach($scope.categoriesList, function (category) {
          categoryCards = category.items;
          addCardInStackCard = categoryCards[categoryCards.length-1];
          categoryCards.splice(categoryCards.length-1, 1);
          categoryCards.splice(0, 0, addCardInStackCard);
        })

        calculateCardSize();
      });
    };

    function calculateCardSize() {
      windowWidth = $(window).width();
      windowHeight = $(window).height();
      cardStackHeight = (windowHeight - topNavHeight) / 2;
      cardStackScale = cardStackHeight / originalCardStackHeight;
      cardStackMargin = cardStackScale * originalCardStackMargin;
      cardStackHeight = cardStackHeight - cardStackMargin;
      cardStackTitleHeight = originalCardStackTitleHeight * cardStackScale;
      fontSize = cardStackHeight / originalCardStackHeight * originalFontSize;
      singleCardWidth = originalCardWidthEm * fontSize;
      singleCardHeight = originalCardHeightEm * fontSize;
      $scope.cardStack = {
        style: {
          fontSize: fontSize + 'px'
        }
      };
      calculateCardStackContainerWidth();
    };

    function calculateCardStackContainerWidth() {
      $scope.cardStackContainerWidth = (singleCardWidth + (originalCardStackMarginEm * fontSize * 2)) * (cardStackLength / 2) + 'px';
    };

    $scope.getCardInStackCard = function (category, evt) {
      if(currentDeltaY !== evt.deltaY) {
        isPanningUp = evt.deltaY < 0;
        isPanningDown = evt.deltaY > 0;
        currentDeltaY = evt.deltaY;
        cardStackLength = category.items.length - 1;
        removeCardInStackCard = category.items[1];

        if(isPanningDown && evt.deltaY > (singleCardWidth * .05 )) {
          adjustCardOpacity = 1 + (evt.deltaY / -(singleCardWidth * .075 ));
          if(evt.deltaY > (singleCardWidth * .05 )) {
            evt.deltaY = singleCardWidth * .05;
          }
          removeCardInStackCard.animation = {
            transform: 'translate3d(0, ' + evt.deltaY + 'px, 0)',
            opacity:  adjustCardOpacity
          };

          category.items[2].animation = {
            transform: 'translate3d(0, 0, 0)',
            opacity: 1
          };
          category.items[3].animation = {
            transform: 'translateY(-2.5em) scale3d(.90, .90, 1)',
          };
          category.items[4].animation = {
            transform: 'translateY(-4.8em) scale3d(.80, .80, 1)'
          };
          category.items[5].animation = {
            transform: 'translateY(-6.8em) scale3d(.70, .70, 1)'
          };
          category.items[6].animation = {
            transform: 'translateY(-8.8em) scale3d(.60, .60, 1)',
            opacity: 0
          };


        } else if(isPanningUp && evt.deltaY < -(singleCardWidth * .075 )) {
          if(evt.deltaY > (singleCardWidth * .05 )) {
            evt.deltaY = singleCardWidth * .05;
          }
          
          adjustCardOpacity = 1 + (-evt.deltaY / (singleCardWidth * .075 ));
          category.items[0].animation = {
            transform: 'translate3d(0, 0, 0)',
            opacity: adjustCardOpacity
          };
          category.items[1].animation = {
            transform: 'translateY(-2.5em) scale3d(.90, .90, 1)',
            opacity: 1
          };
          category.items[2].animation = {
            transform: 'translateY(-4.8em) scale3d(.80, .80, 1)'
          };
          category.items[3].animation = {
            transform: 'translateY(-6.8em) scale3d(.70, .70, 1)'
          };
          category.items[4].animation = {
            transform: 'translateY(-8.8em) scale3d(.60, .60, 1)',
            opacity: 0
          };

        } else {
          category.items[0].animation = { };
          category.items[1].animation = { };
          category.items[2].animation = { };
          category.items[3].animation = { };
          category.items[4].animation = { };
          adjustCardOpacity = 1;
        }

      }
      if(evt.isFinal) {
        if(isPanningDown && evt.deltaY > (singleCardWidth * .25)  ) {
          evt.deltaY = (singleCardWidth * .25);
          $scope.getNextCardInStackCard(category);
        } else if (isPanningUp && evt.deltaY < -(singleCardWidth * .25)) {
          $scope.getPrevCardInStackCard(category);
        } else {
          category.items[0].animation = { };
          category.items[1].animation = { };
          category.items[2].animation = { };
          category.items[3].animation = { };
          category.items[4].animation = { };
          removeCardInStackCard.animation = {
            transform: 'translate3d(0, 0, 0)',
            opacity: '1'
          };
        }
      }
    };

    $scope.getNextCardInStackCard = function (category) {
      cardStackLength = category.items.length - 1;
      removeCardInStackCard = category.items[0];
      removeCardInStackCard.animation = {
        transform: 'translate3d(0, ' + (singleCardWidth * .25) + 'px, 0)',
        opacity: '0'
      };

      $timeout(function () {
        category.items.splice(0, 1);
        $timeout(function () {
          category.items.splice(cardStackLength, 0, removeCardInStackCard);
        }, 25);
      }, 25);
    };

    $scope.getPrevCardInStackCard = function (category) {
      cardStackLength = category.items.length - 1;
      addCardInStackCard = category.items[cardStackLength];
      addCardInStackCard.animation = {
        transform: 'translate3d(0, ' + (singleCardWidth * .25) + 'px, 0)',
        opacity: '0'
      };
      category.items.splice(cardStackLength, 1);

      $timeout(function () {
        category.items.splice(0, 0, addCardInStackCard);
        $timeout(function () {
          addCardInStackCard.animation = {};
        }, 25);
      }, 25);
    };

    angular.element($(document).ready(function () {
      topNavHeight = $('.top-nav').height();
      $('.category-scroller').css({'top': topNavHeight + 'px' });

    }));

    $(window).resize(function () {
      $timeout.cancel(reCalculateCardSize);
      reCalculateCardSize = $timeout(function () {
         calculateCardSize();
      },250);
    });

    getCategoryItems();

  });

})();
