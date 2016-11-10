var app = angular.module("dtvModule", ['dtv.background', 'dtv.assetCard']);

app.controller("homeController", function($scope, $http, $filter, $timeout, $document, $interval, $window){
  var videoTabNavWidth,
    baseFontSize = 16,
    baseThumbnailWidthEm = 22,
    baseTabNavTabWidthEm = 15,
    videoTabContentWidth = baseFontSize * baseThumbnailWidthEm,
    videoTabNavTabWidth = baseFontSize * baseTabNavTabWidthEm,
    videoNavWidth = videoTabContentWidth + videoTabNavTabWidth,
    hideVideoTabNavTimer;

  getCarouselData();

  $scope.videoTabNav = {
    style: {
      transition: '.25s',
      transform: 'translate3d(' + videoNavWidth + 'px, 0, 0)',
      width: videoNavWidth + 'px'
    },
    tab: {
      style: {
        width: videoTabNavTabWidth + 'px'
      }
    },
    content: {
      style: {
        width: videoTabContentWidth + 'px'
      }
    },
    controls: {
      style: {
        right: 0
      }
    }
  };

  function getCarouselData(){
    $http.get("/_shared/ngtv2/data.json").success(function(data){
      $scope.categoriesList = data;
      $scope.videoPlayerSideBarNav = data
      // $scope.videoPlayerSideBarNav[0].active = true;
      cardStackLength = $scope.categoriesList.length;

      angular.forEach($scope.categoriesList, function (category) {
        categoryCards = category.items;
        // addCardInStackCard = categoryCards[categoryCards.length-1];
        // categoryCards.splice(categoryCards.length-1, 1);
        // categoryCards.splice(0, 0, addCardInStackCard);
      })
    });
  };

  $scope.viewDetailsModal = function (card) {
    $scope.dtvModal = {
      active: true,
      ngModel: card,
      type: 'details'
    }
  };

  $scope.playVideo = function (category) {
    $scope.dtvModal = {
      active: true,
      ngModel: {
        nav: $scope.videoPlayerSideBarNav
      },
      type: 'videoPlayer'
    }
  }


  // $scope.revealVideoTabNavContent = function (tab) {
  //   angular.forEach($scope.videoPlayerSideBarNav, function (tab) {
  //     tab.active = false;
  //   });
  //   tab.active = true;

  //   $scope.videoTabNav.style.transition = '.25s';
  //   $scope.videoTabNav.style.transform = 'translate3d(0, 0, 0)';

  //   $scope.videoTabNav.videoList = {
  //     style: {
  //       transform: 'translate3d(0, 150px, 0)'      
  //     }
  //   }

  //   $timeout(function () {
  //     displayVideoTabNavcontentList();
  //   }, 500)

  // };

  // function displayVideoTabNavcontentList() {
  //   $scope.videoTabNav.videoList = {
  //     style: {
  //       transition: '.25s',
  //       transform: 'translate3d(0, 0, 0)',
  //       opacity: 1
  //     }
  //   }
  // }

  // $scope.closeVideoTabNavContent = function (tab) {
  //   tab.style = {
  //     transition: '.25s'
  //   };
  //   tab.icon = {
  //     style: {
  //       transition: '.25s',
  //       transform: 'rotate(0)'
  //     }
  //   };
  //   $scope.videoTabNav.videoList = {
  //     style: {
  //       transition: '.25s',
  //       opacity: 0
  //     }
  //   }
   
  //   $scope.videoTabNav.style.transition = '.25s';
  //   $scope.videoTabNav.style.transform = 'translate3d(' + videoTabContentWidth + 'px, 0, 0)';

  //   $timeout(function () {
  //     angular.forEach($scope.videoPlayerSideBarNav, function (tab) {
  //       tab.active = false;
  //     });
  //   }, 250)
  // }


  // $scope.revealVideoTabNav = function() {
  //   $timeout.cancel(hideVideoTabNavTimer);
  //   if(!$scope.videoTabNav.active) {
  //     $scope.videoTabNav.active = true;
  //     $scope.videoTabNav.style.transition = '.25s';
  //     $scope.videoTabNav.style.transform = 'translate3d(' + videoTabContentWidth + 'px, 0, 0)';
  //     $scope.videoTabNav.controls.style.opacity = 1;
  //     $scope.videoTabNav.controls.style.transition = '.25s';

  //   }
  // };

  // $scope.hideVideoTabNav = function() {
  //   $scope.videoTabNav.active = false;
  //   $scope.videoTabNav.style.transition = '.25s';
  //   $scope.videoTabNav.style.transform = 'translate3d(' + videoNavWidth + 'px, 0, 0)';

  //   $timeout(function () {
  //     angular.forEach($scope.videoPlayerSideBarNav, function (tab) {
  //       tab.active = false;
  //       tab.icon = {};
  //     });
  //   }, 250);

  // };

  // $scope.videoTabNavTabMouseEnter = function (tab) {
  //   tab.style = {
  //     transition: '.25s',
  //     background: '#187bf3'
  //   }
  //   tab.icon = {
  //     style: {
  //       transition: '.25s',
  //       transform: 'rotate(180deg)'
  //     }
  //   }
  // }

  // $scope.videoTabNavTabMouseLeave = function (tab) {
  //   tab.style = {
  //     transition: '.25s'
  //   };
  //   if(!tab.active) {
  //     tab.icon = {
  //       style: {
  //         transition: '.25s',
  //         transform: 'rotate(0)'
  //       }
  //     };
  //   }
  // };




});