desktop.controller('desktop.ClipModalController', function($scope, $element, $state, $stateParams, $previousState, $timeout, $dtvApi){
  //TO-DO: refactor

  //TO-DO: below hero carousel code is for POC only

  $dtvApi.details($stateParams.media_type, $stateParams.id).then(function(data){
    $scope.card = data;
    
    $scope.show = 'Gotham';
    $scope.genres = 'Movie, Trailer, ' + data.genres.join(', ');

    // duration
    $scope.duration = '3:06';

    // sets background image of modal
    $scope.modal = {
      style: {
        backgroundImage: 'url(' + $scope.card.backdrop_path + ')',
        backgroundRepeat: 'no-repeat'
      }
    };

    setDescription(data);
    setModalTabs();
  });

  $scope.isShow = ($stateParams.media_type === 'show');
  $scope.isClip = true;
  
  $scope.breakPoints = [
    {maxWidth: 3000, columns:4, spacingX: 20, spacingY: 20 }
  ];

  $scope.active = true;
  var modalTabHeaderHeight = 72,
    modalHeaderHeight = 150,
    modalHeight = angular.element($('.modal-content').height())[0],
    modalBodyContentHeight,
    modalContainerWidth,
    modalTranslateX,
    modalTranslateY,
    dynamicTabWidth;

  $scope.selectedSeasonNumber = "1";


  $scope.modalWhiteBar = ($scope.isShow) ? {
    style: {}
  } : { style: { height: '35%'}};
  $scope.titleRow = {
    style: {}
  };
  $scope.seriesTitle = {
    style: {}
  };

  $scope.infoContainer = {
    style: {}
  };

  $scope.episodesTab = {
    data: {}
  };

  $scope.moreFrom = function () {
    $scope.moreFrom = 'More From ' + $scope.webChannel;
  };

  $scope.selectSeasonData = function (selectedSeasonNumber) {
    $scope.selectedSeasonNumber = selectedSeasonNumber.toString();
    getSeasonInfo();
  };

  function getModalDetails() {
    $dtvApi.details($stateParams.media_type, $stateParams.id).then(function(response) {
      $scope.details = response;
      if($stateParams.media_type !== 'movie')
        $scope.selectedSeasonNumber = response.seasons[0];
      $scope.card = response;
    }, function (response) {
    });
  }

  function getSeasonInfo(){
    $dtvApi.seasonInfo($scope.details.id, $scope.selectedSeasonNumber).then(function (response) {
      $scope.episodesTab.data.episodes = response.episodes;
    }, function (response) {
      console.log('error');
    });
  }

  $scope.getStyle = function(carousel){
    return {
      backgroundImage: 'url(' + carousel.backdrop_path.replace('/w500', '/w1920') + ')',
      backgroundRepeat: 'no-repeat'
    };
  };

  // click the chevron and it will bring the modal back to its default state
  $scope.minimizeModalTabs = function() {
    $scope.isFavorite = false;
    $scope.tabsActive = false;
    $scope.modalTabs.active = false;

    $scope.modalTabs.activeTab = '';
    $scope.modalTabs.header.style = {};
    $scope.modalWhiteBar.style = {
      height: '40%',
      padding: '0'
    };
    $scope.titleRow.style = {
      height: '19%'
    };
    delete $scope.infoContainer.style;  
    $scope.modalTabs.style = {
      background: '#fff',
      height: '30%',
      boxShadow: ''
    };
  };

  $scope.selectTab = function(tab) {
    $dtvApi.randomCarousel().then(
      function (response) {
        $scope.clipData = response;
      }, function (response) {
        console.log('error');
    });

    $dtvApi.seasonInfo($stateParams.id, $scope.details.seasons[0].season_number).then(function(data){
      $scope.selectedSeasonNumber = $scope.details.seasons[0].season_number.toString();
      $scope.episodesTab.data = data;
      angular.forEach($scope.episodesTab.data.episodes, function(episode) {
        episode.isFavorite = false;
      }); 
    });

    

    $dtvApi.tvCastDetails($stateParams.id).then(function(data){
      var actorIds = _.pluck(data, 'id');
      $dtvApi.actorRoles(actorIds).then(function(castRoles) {
        angular.forEach(castRoles, function(actorRoles, index) {
          var _actorRoles = [];
          for (var i = 0; i <= 2; i++) {
             // TO-DO: if title doesnt equal current title
            _actorRoles.push([actorRoles.data.cast[i].title, actorRoles.data.cast[i].character]);
          }
          
          data[index].metadata = _actorRoles;
        });
        $scope.actors = data;
      });
    });

    $scope.seasons = $scope.details.seasons.length;





    angular.forEach($scope.modalTabs.tabs, function(tab) {
      tab.active = false;
    });
    tab.active = true;
    $scope.tabsActive = true;
    $scope.modalTabs.activeTab = tab.value;
    $scope.modalTabs.active = true;
    
    $scope.modalWhiteBar.style = {
      transition: '0.5s cubic-bezier(.39,.01,.26,1.02)',
      height: '100%',
      padding: '0'
    };

    $scope.titleRow.style = {
      height: '10%'
    };
    $scope.seriesTitle.style = {
      
    };

    $scope.infoContainer.style = {
      height: 0,
      opacity: 0,
      overflow: 'hidden',
      padding: 0,
      transition: '0.5s'
    };

    $scope.modalTabs.style = {
      background: '#eee',
      height: '100%',
      boxShadow: 'inset 0 6px 6px -6px #999'
    };

    $scope.modalTabs.header = {
      style: {
        background: 'rgba(255,255,255,.8)'
      }
    };
    $scope.modalBodyContent = {
      style: {
        height: 0
      }
    };
  };

  function setModalTabs() {
    $scope.modalTabs = {
      tabs: [{
        name: 'More From ' + $scope.show,
        value: 'moreFromShow',
        active: false
      }, {
        name: 'Similar Clips',
        value: 'similarClips',
        active: false
      }, {
        name: 'More From MovieClips Trailers',
        value: 'moreFromMovieClips',
        active: false
      }],
      activeTab: '',
      active: false,
      style: ''
    };

    dynamicTabWidth = 100 / $scope.modalTabs.tabs.length;
  }

  function setDescription(data) {

    $scope.description = _.trunc(data.description, {'length': 630, 'separator': /,? +/});
  }

  $scope.launchVideoPlayerModal = function() {
    $state.go('modal.videoplayer', {data:$scope.card});
  };

  getModalDetails();

  // TO-DO: Move everything from function detailsLink() to here
  // detailsLink($scope, null, null, $timeout, null )
});