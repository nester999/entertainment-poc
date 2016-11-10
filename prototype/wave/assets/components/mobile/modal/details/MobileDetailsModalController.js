mobileApp.controller('mobile.DetailsModalController', function($scope, $element, $state, $stateParams, $previousState, $dtvApi, $timeout){  
  var modalTabHeaderHeight = 72,
    modalHeaderHeight = 150,
    windowHeight = angular.element($(window).outerHeight())[0],
    modalHeight = angular.element($('.modal-content').outerHeight())[0],
    modalBodyContentHeight,
    modalContainerWidth,
    modalTranslateX,
    modalTranslateY,
    mainScrollWindowHeight,
    selectedTab;
    $scope.modal = {}
    $scope.modalBody = {};
    $scope.closeTabBtn = {};
    $scope.details = {};
    $scope.detailsBtn = {};
    $scope.modalTemplateUrl = {};
    $scope.modalBody = {
      style: {}
    };

  $scope.breakPoints = [
    {maxWidth: 3000, columns:2, spacingX: 20, spacingY: 20 }
  ];
  $scope.modalOverlay = {
    style: {
      opacity: 0
    }
  }
  $scope.moreWaysToWatchTabs = {
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

  $scope.modalDetails = {
    body: {
      style: {}
    },
    scroll: {
      style: {}
    },
    style: {}

  };
  
  $scope.moreWaysToWatchNav = {
    style: {
      opacity: 0
    }
  };

  $scope.modalTabs = {
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
    header: {
      style: {}
    },
    activeTab: '',
    style: ''
  };

  // Remove All Episodes tab from movies Modal
  if($stateParams.media_type === 'movie') {
    $scope.modalTabs.tabs.shift();
  }

  // Adds backdropphoto
  $dtvApi.backdrops($stateParams.media_type, $stateParams.id).then(function(data) {
    $scope.modalOverlay = {
      style: {
        backgroundImage: 'url(' + data + ')'
      }
    }

    $('.backdrop.dtv-background-cover').addClass('loaded');
  }, function (response) {
    console.log('error: ' + response);
  });

  function getModalDetails() {
    $dtvApi.details($stateParams.media_type, $stateParams.id).then(function(response) {
      $scope.details = response;
      $scope.card = response;
    }, function (response) {
      console.log('error: ' + response);
    });
  }

  function getSeasonInfo(){
    $scope.modalTabs.loading = true;
    animateSwitchTabsContentOut();
    $dtvApi.seasonInfo($scope.details.id, $scope.selectedSeasonNumber).then(function (response) {
      $scope.episodes = response.episodes;
      animateSwitchTabsContentIn();
    }, function (response) {
      console.log('error');
    });
  }

  function getTitleClips() {
    $scope.modalTabs.loading = true;
    animateSwitchTabsContentOut();
    $dtvApi.getTitleClips($stateParams.media_type, $scope.details.id).then(
      function (response) {
        $scope.clipData = response;
        animateSwitchTabsContentIn();
      }, function (response) {
        console.log('error');
    });
  }

  function getSimilarTitles() {
    $scope.modalTabs.loading = true;
    animateSwitchTabsContentOut();
    $dtvApi.getSimilarTitles($stateParams.media_type, $scope.details.id).then(
      function (response) {
        $scope.clipData = response;
        animateSwitchTabsContentIn();
      }, function (response) {
        console.log('error');
    }).finally(function (response){
      $scope.modalTabs.loading = false;
    });
  }

  function switchTabs(tabs, tab) {
    angular.forEach(tabs, function(tab) {
      tab.active = false;
    });
    tab.active = true;
  }

  function animateSwitchTabsContentOut() {
    $scope.modalDetails.scroll.style.opacity = '0';
  }

  function animateSwitchTabsContentIn() {
    $timeout(function() {
      $scope.modalDetails.scroll.style.transform = 'transitionY(0)';
      $scope.modalDetails.scroll.style.opacity = '1';
    }, 50);
    $scope.modalTabs.loading = false;
  }

  function switchTabsContent(selectedTab) {
    switch(selectedTab) {
      case 'allEpisodes':
        $scope.selectedSeasonNumber = $scope.details.seasons[0].season_number.toString();
        getSeasonInfo();
        break;
      case 'clips':
        getTitleClips();
        break;
      case 'similarShows':
        getSimilarTitles();
        break;
    }    
  }

  $scope.selectSeasonData = function (selectedSeasonNumber) {
    $scope.selectedSeasonNumber = selectedSeasonNumber;
    getSeasonInfo();
  };

  $scope.mainTabSelection = function (tabs) {
    selectedTab = this.tab;
    if(this.tab.active !== true) {
      if($scope.modalTabs.activeTab === '') {
        modalHeight = angular.element($('.modal-content').outerHeight())[0];
      }
      switchTabs(tabs, this.tab);
      delete $scope.modalDetails.scroll.style.height;
      delete $scope.modalDetails.scroll.style.transform;
      delete $scope.modalDetails.scroll.style.opacity;

      $scope.modalTabs.template = '';
      $scope.modalTabs.activeTab = this.tab.value;
      $scope.modalTabs.template = this.tab.value;
      $scope.detailsBtn.style = {
        display: 'none'
      }
      $scope.modalDetails.body.style = {
        height: '0'
      };
      $scope.closeTabBtn.style = {
        display: 'block'
      }

      $timeout(function () {
        mainScrollWindowHeight = $(window).height() - $('.modal-content.details .dtv-scroll').offset().top;
        $scope.modalDetails.scroll.style.height = mainScrollWindowHeight + 'px';
        $scope.modalDetails.scroll.style.transform = 'transitionY('+ mainScrollWindowHeight +'px)';
        switchTabsContent(selectedTab.value);
      }, 500);
    }
    $scope.modalTabs.header.style.borderBottom = '1px solid #CCC'
    $scope.modalBody.style.height = (windowHeight - modalHeight) / 2 + modalHeight + 'px';
    $scope.modalDetails.style.height = (windowHeight - modalHeight) / 2 + modalHeight + 'px';
  };
  
  $scope.closeMainTab = function () {
    angular.forEach($scope.modalTabs.tabs, function(tab) {
      tab.active = false;
    })

    $scope.modalTabs.activeTab = '';
    delete $scope.detailsBtn.style.display;
    delete $scope.modalDetails.body.style;
    delete $scope.closeTabBtn.style.display;
    delete $scope.modalBody.style.height;
    delete $scope.modalDetails.style.height;
    delete $scope.modalDetails.scroll.style.height;
    delete $scope.modalTabs.header.style.borderBottom;
  }

  $scope.toggleMoreWaysToWatchNav = function () {
    if (!$scope.moreWaysToWatchTabs.active){
      $scope.moreWaysToWatchTabs.active = true;
      $scope.modalBody.style = {
        width: '818px'
      }
      $timeout(function () {
       $scope.moreWaysToWatchNav = {
          style: {
            opacity: 1
          }
        };
      }, 400)
    } else {
      $scope.moreWaysToWatchTabs.active = false;
      $scope.moreWaysToWatchNav.style.opacity = 0;
      $timeout(function () {
        delete $scope.modalBody.style.width;
      }, 400)
    }
  }

  $scope.moreWaysToWatchNavTabSelection = function(tabs) {
    switchTabs(tabs, this.tab);
    $scope.moreWaysToWatchTabs.activeTab = this.tab.value;
  }

  $scope.launchVideoPlayerModal = function() {
    $state.go('modal.videoplayer', {data:$scope.card});
  };

  $scope.closeModal = function() {
    $state.go('app');
  };

  getModalDetails();

});