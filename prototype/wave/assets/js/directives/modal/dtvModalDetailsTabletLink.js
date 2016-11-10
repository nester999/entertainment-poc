function detailsTabletLink(scope, elem, attr, $http, $timeout, $dtvApi, $dtvModal) {
  console.log('loading details modal link');
  var modalTabHeaderHeight = 72,
    modalHeaderHeight = 150,
    windowHeight = angular.element($(window).outerHeight())[0],
    modalHeight = angular.element($('.modal-content').outerHeight())[0],
    modalBodyContentHeight,
    modalContainerWidth,
    modalTranslateX,
    modalTranslateY,
    mainScrollWindowHeight;
    scope.modal = {}
    scope.modalBody = {};
    scope.closeTabBtn = {};
    scope.details = {};
    scope.detailsBtn = {};
    scope.modalTemplateUrl = {};
    scope.modalBody = {
      style: {}
    };
    scope.modalDetails = {
      body: {
        style: {}
      },
      scroll: {
        style: {}
      },
      style: {}

    }
    scope.moreWaysToWatchNav = {
      style: {
        opacity: 0
      }
    };

  scope.modalTabs = {
    tabs: [
      {
        name: 'All Episodes',
        value: 'allEpisodes'
      },{
        name: 'Clips',
        value: 'clips'
      },{
        name: 'Similar Shows',
        value: 'similarShows'
      }
    ],
    activeTab: '',
    style: ''
  };

  scope.moreWaysToWatchTabs = {
    tabs: [
      {
        name: 'Ipad',
        value: 'ipad',
        active: true
      },
      {
        name: 'TV',
        value: 'tv'
      },
    ],
    activeTab: 'ipad',
    active: false
  };

  if(scope.active) {
    scope.modalOverlay = {
      style: {
        opacity: 1
      }
    };
  }

  function getModalDetails() {
    switch(scope.ngModel.media_type){
      case 'show':
        scope.modalTemplateUrl = 'assets/js/directives/modal/dtvModalDetailsTabletSeriesTemplate.html';
        break;
      default:
        scope.modalTemplateUrl = 'assets/js/directives/modal/dtvModalDetailsTabletMovieTemplate.html';
        break;
    }
    $dtvApi.details(scope.ngModel.media_type, scope.ngModel.id).then(function(response) {
      scope.details = response;
    }, function (response) {
      console.log('error: ' + response);
    });
  }

  function getSeasonInfo(){
    $dtvApi.seasonInfo(scope.details.id, scope.selectedSeasonNumber).then(function (response) {
      scope.episodes = response.episodes;
    }, function (response) {
      console.log('error');
    });
  }

  function getSeriesClips() {
    $http.get('data/clips.json').then(
      function (response) {
        scope.clipData = response.data;
      }, function (response) {
        console.log('error');
    });
  }

  function getSimiliarShows() {
    $dtvApi.randomCarousel().then(
    // $http.get('data/clips.json').then(
      function (response) {
        scope.clipData = response;
      }, function (response) {
        console.log('error');
    });
  }

  function switchTabs(tabs, tab) {
    angular.forEach(tabs, function(tab) {
      tab.active = false;
    });
    tab.active = true;
  }

  scope.selectSeasonData = function (selectedSeasonNumber) {
    scope.selectedSeasonNumber = selectedSeasonNumber;
    getSeasonInfo();
  }

  scope.mainTabSelection = function (tabs) {
    if(this.tab.active !== true) {
      if(scope.modalTabs.activeTab === '') {
        modalHeight = angular.element($('.modal-content').outerHeight())[0];
      }
      switchTabs(tabs, this.tab);
      delete scope.modalDetails.scroll.style.height;
      delete scope.modalDetails.scroll.style.transform;
      delete scope.modalDetails.scroll.style.opacity;

      scope.modalTabs.template = '';
      scope.modalTabs.activeTab = this.tab.value;
      scope.modalTabs.template = this.tab.value;
      scope.detailsBtn.style = {
        display: 'none'
      }
      scope.modalDetails.body.style = {
        height: '0'
      };
      scope.closeTabBtn.style = {
        display: 'block'
      }
      $timeout(function () {
        mainScrollWindowHeight = $(window).height() - $('.modal-content.details .dtv-scroll').offset().top;
        scope.modalDetails.scroll.style.height = mainScrollWindowHeight + 'px';
        scope.modalDetails.scroll.style.transform = 'transitionY('+ mainScrollWindowHeight +'px)';
        $timeout(function() {
          scope.modalDetails.scroll.style.transform = 'transitionY(0)';
          scope.modalDetails.scroll.style.opacity = '1';
        }, 50)
      }, 500);
    }

    scope.modalBody.style.height = (windowHeight - modalHeight) / 2 + modalHeight + 'px';
    scope.modalDetails.style.height = (windowHeight - modalHeight) / 2 + modalHeight + 'px';

    switch(this.tab.value) {
      case 'allEpisodes':
        scope.selectedSeasonNumber = scope.details.seasons[0].season_number.toString();
        getSeasonInfo();
        break;
      case 'clips':
        getSeriesClips();
        break;
      case 'similarShows':
        getSimiliarShows()
        break;
    }    
  };

  scope.closeMainTab = function () {
    angular.forEach(scope.modalTabs.tabs, function(tab) {
      tab.active = false;
    })

    scope.modalTabs.activeTab = '';
    delete scope.detailsBtn.style.display;
    delete scope.modalDetails.body.style;
    delete scope.closeTabBtn.style.display;
    delete scope.modalBody.style.height;
    delete scope.modalDetails.style.height;
    delete scope.modalDetails.scroll.style.height;
  }

  scope.toggleMoreWaysToWatchNav = function () {
    if (!scope.moreWaysToWatchTabs.active){
      scope.moreWaysToWatchTabs.active = true;
      scope.modalBody.style = {
        width: '818px'
      }
      $timeout(function () {
        scope.moreWaysToWatchNav = {
          style: {
            opacity: 1
          }
        };
      }, 400)
    } else {
      scope.moreWaysToWatchTabs.active = false;
      scope.moreWaysToWatchNav.style.opacity = 0;
      $timeout(function () {
        delete scope.modalBody.style.width;
      }, 400)
    }
  }

  scope.moreWaysToWatchNavTabSelection = function(tabs) {
    switchTabs(tabs, this.tab);
    scope.moreWaysToWatchTabs.activeTab = this.tab.value;
  }

  scope.closeModal = function() {
    $dtvModal.close();
  };

  getModalDetails();

};
