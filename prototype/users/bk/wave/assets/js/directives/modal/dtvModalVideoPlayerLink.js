function videoPlayerLink(scope, elem, attr, $timeout, $dtvModal) {

  console.log(scope);

  scope.videoSideBarNav = scope.ngModel.nav;
  console.log('loading video player link');

  $('body, html').css('overflow', 'hidden');

  var videoTabNavWidth,
    baseFontSize = 16,
    baseThumbnailWidthEm = 22,
    baseTabNavTabWidthEm = 20,
    videoTabContentWidth = baseFontSize * baseThumbnailWidthEm,
    videoTabNavTabWidth = baseFontSize * baseTabNavTabWidthEm,
    videoNavWidth = videoTabContentWidth + videoTabNavTabWidth,
    hideVideoTabNavTimer,
    videoListHeight;

  scope.modal = {
    style: {
      zIndex: '10000'
    },
    overlay: {
      style: {
        opacity: 1,
        backgroundColor: 'rgba(000, 000, 000, 1)'
      }
    }
  }
  scope.videoTabNav = {
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

  scope.revealVideoTabNavContent = function (tab) {
    angular.forEach(scope.videoSideBarNav, function (tab) {
      tab.active = false;
    });
    tab.active = true;

    scope.videoTabNav.style.transition = '.25s';
    scope.videoTabNav.style.transform = 'translate3d(0, 0, 0)';

    scope.videoTabNav.videoList = {
      style: {
        transform: 'translate3d(0, 150px, 0)'
      }
    }

    $timeout(function () {
      displayVideoTabNavcontentList();
    }, 500)

  };

  function displayVideoTabNavcontentList() {
    videoListHeight = $(window).height() - $('.tab-content-header').outerHeight(true)
    scope.videoTabNav.videoList = {
      style: {
        transition: '.25s',
        transform: 'translate3d(0, 0, 0)',
        opacity: 1,
        overflowY: 'hidden'
      }
    }
    $timeout(function () {
      scope.videoTabNav.videoList.style.height = videoListHeight + 'px';
      scope.videoTabNav.videoList.style.overflowY = 'scroll';
    }, 500);
  }

  scope.closeVideoTabNavContent = function (tab) {
    tab.style = {
      transition: '.25s'
    };
    tab.icon = {
      style: {
        transition: '.25s',
        transform: 'rotate(0)'
      }
    };
    scope.videoTabNav.videoList = {
      style: {
        transition: '.25s',
        opacity: 0
      }
    }
   
    scope.videoTabNav.style.transition = '.25s';
    scope.videoTabNav.style.transform = 'translate3d(' + videoTabContentWidth + 'px, 0, 0)';

    $timeout(function () {
      angular.forEach(scope.videoSideBarNav, function (tab) {
        tab.active = false;
      });
    }, 250)
  }

  scope.revealVideoTabNav = function() {
    // $timeout.cancel(hideVideoTabNavTimer);
    if(!scope.videoTabNav.active) {
      scope.videoTabNav.active = true;
      scope.videoTabNav.style.transition = '.25s';
      scope.videoTabNav.style.transform = 'translate3d(' + videoTabContentWidth + 'px, 0, 0)';
      scope.videoTabNav.controls.style.opacity = 1;
      scope.videoTabNav.controls.style.transition = '.25s';

    }
  };

  scope.hideVideoTabNav = function() {
    scope.videoTabNav.active = false;
    scope.videoTabNav.style.transition = '.25s';
    scope.videoTabNav.style.transform = 'translate3d(' + videoNavWidth + 'px, 0, 0)';

    $timeout(function () {
      angular.forEach(scope.videoSideBarNav, function (tab) {
        tab.active = false;
        tab.icon = {};
      });
    }, 250);

  };

  scope.videoTabNavTabMouseEnter = function (tab) {
    tab.style = {
      transition: '.25s',
      background: '#187bf3'
    }
    tab.icon = {
      style: {
        transition: '.25s',
        transform: 'rotate(180deg)'
      }
    }
  }

  scope.videoTabNavTabMouseLeave = function (tab) {
    tab.style = {
      transition: '.25s'
    };
    if(!tab.active) {
      tab.icon = {
        style: {
          transition: '.25s',
          transform: 'rotate(0)'
        }
      };
    }
  };

  // scope.closeModal = function () {
  //   $dtvModal.close();
  // };

};