desktop.controller('desktop.SportsModalController', function($scope, $element, $state, $stateParams, $previousState, $timeout, $dtvApi){
  //TO-DO: refactor

  //TO-DO: below hero carousel code is for POC only

  $dtvApi.details($stateParams.media_type, $stateParams.id).then(function(data){
    $scope.card = data;
    var hasTeams = true;
    if(hasTeams) {
      $scope.awayTeamCity = 'Detroit';
      $scope.awayTeamName = 'Tigers';
      $scope.homeTeamCity = 'Chicago';
      $scope.homeTeamName = 'Cubs';
    }
    $scope.fullMatchup = $scope.awayTeamCity + ' ' + $scope.awayTeamName + ' at ' + $scope.homeTeamCity + ' ' + $scope.homeTeamName;
    $scope.matchTitle = $scope.awayTeamName + ' @ ' + $scope.homeTeamName;
    $scope.sport = "Baseball";
    $scope.gameInfo = [$scope.sport, 'Sports Event', 'SD', 'HD'];
    $scope.game = $scope.gameInfo.join(', ');
    $scope.gameRating = 'NR[Not Rated)';
    $scope.liveShowing = true ? 'Live: ' : 'Previously Aired: ';
    $scope.airDate = 'August 28, 2015';
    $scope.startTime = '8:00';
    $scope.endTime = '11:00';
    $scope.audio = ['CC', 'Stereo'];
    $scope.audioOptions = $scope.audio.join(', ');

    // sets background image of modal
    $scope.modal = {
      style: {
        backgroundImage: 'url(' + $scope.card.backdrop_path + ')',
        backgroundRepeat: 'no-repeat'
      }
    };
  });

  $scope.isShow = true;
  $scope.isSports = true;
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
    modalTranslateY;

  // populates modal tabs  
  $scope.modalTabs = {
    tabs: [{
      name: 'Upcoming Games',
      value: 'upcomingGames',
      active: false
    }, {
      name: 'More From These Teams',
      value: 'moreFromTheseTeams',
      active: false
    }, {
      name: 'Players',
      value: 'players',
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
  var dynamicTabWidth = 100 / $scope.modalTabs.tabs.length;

  $scope.tabWidth = {
    style: {
      width: dynamicTabWidth + '%'
    }
  }
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

  $scope.selectSeasonData = function (selectedSeasonNumber) {
    $scope.selectedSeasonNumber = selectedSeasonNumber.toString();
    getSeasonInfo();
  };

  function getModalDetails() {
    $dtvApi.details($stateParams.media_type, $stateParams.id).then(function(response) {
      $scope.details = response;
      $scope.selectedSeasonNumber = response.seasons[0];
      $scope.card = response;
    }, function (response) {
      console.log('error: ' + response);
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


  
  $scope.launchVideoPlayerModal = function() {
    $state.go('modal.videoplayer', {data:$scope.card});
  };

  getModalDetails();

  // TO-DO: Move everything from function detailsLink() to here
  // detailsLink($scope, null, null, $timeout, null )
});