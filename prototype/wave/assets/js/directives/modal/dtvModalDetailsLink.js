function detailsLink(scope, elem, attr, $rootScope,$dtvModal) {
  // console.log('loading details modal link');
  var modalTabHeaderHeight = 72,
    modalHeaderHeight = 150,
    modalHeight = angular.element($('.modal-content').height())[0],
    modalBodyContentHeight,
    modalContainerWidth,
    modalTranslateX,
    modalTranslateY;
    scope.modalWhiteBar = {
      style: {}
    };
    scope.titleRow = {
      style: {}
    };
    scope.seriesTitle = {
      style: {}
    };

    scope.infoContainer = {
      style: {}
    };
    scope.modalTabs = {
      style: {}
    };


  function closeModalTabs() {
    delete scope.modalTabs.headerStyle;
    delete scope.modalTabs.style;
    scope.isFavorite = false;
    scope.tabsActive = false;
    scope.modalTabs.activeTab = '';
    scope.modalTabs.header.style = {};
    // scope.modalTabs.style = {
    //   top: modalBodyContentHeight + 'px',
    //   transition: '.25s'
    // };
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

  scope.toggleFavorite = function() {
    console.log(scope.ngModel);
    var currentIconClass = (scope.isFavorite) ? 'icon-dtv2-favorite' : 'icon-dtv2-favorite-o';
    scope.isFavorite = !scope.isFavorite;
    var newIconClass = (scope.isFavorite) ? 'icon-dtv2-favorite' : 'icon-dtv2-favorite-o';
    $('#favorite').toggleClass(currentIconClass);
    $('#favorite').toggleClass(newIconClass);
  };

  scope.closeModal = function() {
    scope.isFavorite = false;
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
      value: 'allEpisodes',
      active: false
    }, {
      name: 'Clips',
      value: 'clips',
      active: false
    }, {
      name: 'Cast & Crew',
      value: 'castCrew',
      active: false
    }, {
      name: 'Similar Shows',
      value: 'similarShows',
      active: false
    }],
    activeTab: '',
    active: false,
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

    // scope.modal.style.transform = 'translate3d(' + modalTranslateX + ', ' + modalTranslateY + ' ,0)';
    // setTimeout(function() {
    //   scope.modal.style.transform = 'translate3d(' + modalTranslateX + ', 0, 0)';
    //   scope.modal.style.transition = '.25s';
    // }, 100);
  }

  scope.selectTab = function(tab) {
    angular.forEach(scope.modalTabs.tabs, function(tab) {
      tab.active = false;
    });
    tab.active = true;
    scope.tabsActive = true;
    scope.modalTabs.activeTab = tab;
    scope.modalTabs.active = true;
    
    scope.modalWhiteBar.style = {
      transition: '0.5s cubic-bezier(.39,.01,.26,1.02)',
      height: '100%',
      padding: '0'
    };

    // delete scope.titleRow.style.height;
    scope.titleRow.style = {
      height: '10%'
    };
    scope.seriesTitle.style = {
      
    };

    scope.infoContainer.style = {
      height: 0,
      overflow: 'hidden',
      padding: 0,
      transition: '0.25s'
    };

    scope.modalTabs.style = {
      background: '#eee',
      transition: '0.5s',
      height: '100%',
      boxShadow: 'inset 0 6px 6px -6px #999'
    };

    // scope.modalTabs.header = {
    //   style: {
    //     background: 'rgba(255,255,255,.8)'
    //   }
    // };
    // scope.modalTabs.activeTab = {

    // };
    // scope.modalTabs.style = {
    //   top: 0,
    //   transition: '.25s'
    // }

    // scope.modalBodyContent = {
    //   style: {
    //     height: 0
    //   }
    // };
  };

  scope.watchVideo = function() {
    scope.showSeriesDetail = false;
    scope.showVideoPlayer = true;
  }

};
