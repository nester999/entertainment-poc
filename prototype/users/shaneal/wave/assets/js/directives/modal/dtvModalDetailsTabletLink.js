function detailsTabletLink(scope, elem, attr, $http) {
  console.log('loading details modal link');
  var modalTabHeaderHeight = 72,
    modalHeaderHeight = 150,
    windowHeight = angular.element($(window).outerHeight())[0],
    modalHeight = angular.element($('.modal-content').outerHeight())[0],
    modalBodyContentHeight,
    modalContainerWidth,
    modalTranslateX,
    modalTranslateY;
    scope.modal = {}
    scope.modalBody = {};
    scope.closeTabBtn = {};
    scope.detailsBtn = {};

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
  }

  if(scope.active) {
    scope.modalOverlay = {
      style: {
        opacity: 1
      }
    };
  }



  scope.tabSelect = function (tab){
    modalHeight = angular.element($('.modal-content').outerHeight())[0];

    if(tab.value !== scope.modalTabs.activeTab) {
      angular.forEach(scope.modalTabs.tabs, function(tab) {
        tab.active = false;
      });
      scope.modalTabs.template = '';
      tab.active = true;
      scope.modalTabs.activeTab = tab.value;
      scope.modalTabs.template = tab.value;
      scope.detailsBtn.style = {
        display: 'none'
      }
      scope.modalBody.style = {
        height: '0'
      };
      scope.closeTabBtn.style = {
        display: 'block'
      }
    }

    scope.modal.style = {
      height: (windowHeight - modalHeight) / 2 + modalHeight + 'px'
    }

    switch(tab.value) {
      case 'allEpisodes':
        $http.get('data/1396-seasons.json').then(
          function (response) {
            scope.episodeData = response.data;
          }, function (response) {
            console.log('error');
        });

        // scope.modalTabs.template = 'all-episodes.html';
        break;
      case 'clips':
        $http.get('data/clips.json').then(
          function (response) {
            scope.clipData = response.data;
          }, function (response) {
            console.log('error');
        });


        scope.modalTabs.template = 'clips.html';
        break;
      case 'similarShows':
        scope.clipData = response.data;
        scope.modalTabs.template = 'clips.html';
        break;
      default: 
        scope.modalTabs.template = '';
    }

  };

  scope.closeTab = function () {
    angular.forEach(scope.modalTabs.tabs, function(tab) {
      tab.active = false;
    })

    scope.modalTabs.activeTab = '';
    delete scope.detailsBtn.style.display;
    delete scope.modalBody.style.height;
    delete scope.closeTabBtn.style.display;
    delete scope.modal.style;
  }

  scope.watchVideo = function () {
    scope.showSeriesDetail = false;
    scope.showVideoPlayer = true;
  }

};