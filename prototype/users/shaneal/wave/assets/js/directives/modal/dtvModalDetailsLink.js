function detailsLink(scope, elem, attr, $rootScope,$dtvModal) {
  // console.log('loading details modal link');
  var modalTabHeaderHeight = 72,
    modalHeaderHeight = 150,
    modalHeight = angular.element($('.modal-content').height())[0],
    modalBodyContentHeight,
    modalContainerWidth,
    modalTranslateX,
    modalTranslateY;

  function closeModalTabs() {
    delete scope.modalTabs.headerStyle;
    delete scope.modalTabs.style;
    scope.tabsActive = false;
    scope.modalTabs.activeTab = '';
    scope.modalTabs.header.style = {};
    scope.modalTabs.style = {
      top: modalBodyContentHeight + 'px',
      transition: '.25s'
    };
    scope.modalBodyContent = {
      style: {
        height: modalBodyContentHeight + 'px',
        width: '0'
      }
    };
  }

  function animateModalSlideOut() {
    modalTranslateX = (modalContainerWidth - (modalContainerWidth * .80)) / 2 + 'px';
    modalTranslateY = modalHeight + 'px';
    scope.modal.style.transform = 'translate3d(' + modalTranslateX + ', ' + modalTranslateY + ' ,0)';
    scope.modalOverlay.style = {
      opacity: 0,
      width: 0
    };

    setTimeout(function() {
      scope.ngModel = {};
      scope.active = false;
      scope.modal.style.transform = 'translate3d(' + modalTranslateX + ', 0, 0)';
      scope.modal.style.transition = '.25s';

    }, 100);

  }

  // scope.closeModal = function() {
  //   if (!scope.tabsActive) {
  //     animateModalSlideOut();
  //   } else {
  //     closeModalTabs();
  //   }
  // };

  scope.closeModal = function() {
    $dtvModal.close();
  };

  scope.launchVideoPlayerModal = function() {
    console.log(scope.ngModel);
    $dtvModal.setModal({
      type: 'videoPlayer',
      data: {
        nav: scope.ngModel.carousels
      }
    });
  };

  scope.modalTabs = {
    tabs: [{
      name: 'All Episodes',
      value: 'allEpisodes'
    }, {
      name: 'Clips',
      value: 'clips'
    }, {
      name: 'Cast & Crew',
      value: 'castCrew'
    }, {
      name: 'Similar Shows',
      value: 'similarShows'
    }],
    activeTab: '',
    style: ''
  };

  if (scope.active) {
    modalContainerWidth = angular.element($('.modal').outerWidth(true))[0];
    modalHeight = angular.element($('.modal-content').outerHeight(true))[0];
    modalBodyContentHeight = modalHeight - modalHeaderHeight - modalTabHeaderHeight;
    scope.modalBodyContent = {
      style: {
        height: modalBodyContentHeight + 'px'
      }
    };
    scope.modalTabs.style = {
      top: modalBodyContentHeight + 'px',
    };
    scope.modalOverlay = {
      style: {
        opacity: 1
      }
    };

    // make the background image higher resolution
    var modalBgImage = scope.ngModel.card.backdrop_path.replace('/w500', '/w1920');

    scope.modal = {
      style: {
        backgroundImage: 'url(' + modalBgImage + ')',
        backgroundRepeat: 'no-repeat'
      }
    };
    animateModalSlideIn();
  }

  function animateModalSlideIn() {
    modalTranslateX = (modalContainerWidth - (modalContainerWidth * .80)) / 2 + 'px';
    modalTranslateY = modalHeight + 'px';

    scope.modal.style.transform = 'translate3d(' + modalTranslateX + ', ' + modalTranslateY + ' ,0)';
    setTimeout(function() {
      scope.modal.style.transform = 'translate3d(' + modalTranslateX + ', 0, 0)';
      scope.modal.style.transition = '.25s';
    }, 100);
  }

  scope.selectTab = function(activeTab) {
    scope.tabsActive = true;
    scope.modalTabs.activeTab = activeTab;
    scope.modalTabs.header = {
      style: {
        background: 'rgba(255,255,255,.8)'
      }
    };
    scope.modalTabs.style = {
      top: 0,
      transition: '.25s'
    }

    scope.modalBodyContent = {
      style: {
        height: 0
      }
    };
  };

  scope.watchVideo = function() {
    scope.showSeriesDetail = false;
    scope.showVideoPlayer = true;
  }

};
