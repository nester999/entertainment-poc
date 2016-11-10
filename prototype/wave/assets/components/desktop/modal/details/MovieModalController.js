desktop.controller('desktop.MovieModalController', function($scope, $element, $state, $stateParams, $previousState, $timeout, $dtvApi){
  //TO-DO: refactor

  //TO-DO: below hero carousel code is for POC only

  $dtvApi.details($stateParams.media_type, $stateParams.id).then(function(data){
    
    setDescription(data);
    $scope.card = data;

    
    var _genres = (data.genres.length > 3) ? _.slice(data.genres, 0, 3) : data.genres;
    $scope.genres = _genres.join(', ');

    var releaseDate = new Date(data.release_date);
    
    $scope.year = releaseDate.getFullYear();
    
    // sets background image of modal
    $scope.modal = {
      style: {
        backgroundImage: 'url(' + $scope.card.poster_path + ')',
        posterPath: 'url(' + $scope.card.poster_path + ')',
        backgroundRepeat: 'no-repeat'
      }
    };

    // get rotten tomatoes score for movie
    $dtvApi.rottenTomatoScore($scope.card.title).then(function(data) {
      setRottenTomatoScore(data);
    });

    // get certification rating i.e. G, PG, PG-13, R, NC-17
    $dtvApi.certificationRating($scope.card.id).then(function(data) {
      setCertificationRating(data);
    });
  });

  
  
  

  $scope.isShow = ($stateParams.media_type === 'show');
  $scope.isMovie = true;
  // $scope.carousels = _.slice(carousels, index).concat(_.slice(carousels, 0, index));
  
  $scope.breakPoints = [
    {maxWidth: 3000, columns:4, spacingX: 20, spacingY: 20 }
  ];

  // $scope.card = card;
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
      name: 'Clips',
      value: 'clips',
      active: false
    }, {
      name: 'Extras',
      value: 'extras',
      active: false
    }, {
      name: 'Similar Movies',
      value: 'similarMovies',
      active: false
    }],
    activeTab: '',
    active: false,
    style: ''
  };

  $scope.startWatching = {
    style: {
      position: 'fixed',
      top: '89px',
      left: '152px',
    }
  };
  $scope.closeOnTop = {
    style : {
      zIndex: 100
    }
  };
  $scope.closeButton = {
    style: {
      color: '#444'
    }
  };
  var dynamicTabWidth = 100 / $scope.modalTabs.tabs.length - 3;

  $scope.tabWidth = {
    style: {
      width: dynamicTabWidth + '%'
    }
  };
  $scope.selectedSeasonNumber = "1";


  $scope.modalWhiteBar = ($scope.isShow) ? {
    style: {}
  } : { style: {height: '100%',
      marginLeft: '46.7%',
      width: '53.4%',
      background: 'rgba(253,253,253,0.92)'}};
  $scope.titleRow = {
    style: {
      height: '9%'
    }
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
      // $scope.selectedSeasonNumber = response.seasons[0];
      $scope.card = response;
    }, function (response) {
      console.log('error: ' + response);
    });
  }

  


  $scope.getStyle = function(carousel){
    return {
      backgroundImage: 'url(' + carousel.backdrop_path.replace('/w500', '/w1920') + ')',
      backgroundRepeat: 'no-repeat'
    };
  };

  // $scope.getStyle = function(carousel){
  //   return {
  //     backgroundImage: 'url(' + carousel.backdrop_path.replace('/w500', '/w1920') + ')',
  //     backgroundRepeat: 'no-repeat'
  //   };
  // };

  // click the chevron and it will bring the modal back to its default state
  $scope.minimizeModalTabs = function() {
    $scope.isFavorite = false;
    $scope.tabsActive = false;
    $scope.modalTabs.active = false;

    $scope.modalTabs.activeTab = '';
    $scope.modalTabs.header.style = {};
    $scope.modalWhiteBar.style = {
      height: '100%',
      marginLeft: '46.7%',
      width: '53.4%'
    };

    delete $scope.infoContainer.style;  
    $scope.modalTabs.style = {
      background: '#fff',
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

  function setDescription(data) {
    $scope.description = _.trunc(data.description, {'length': 400, 'separator': /,? +/});
  }

  function setRottenTomatoScore(data) {
    $scope.rottenTomatoScore = data.rt_ratings;
  }

  function setCertificationRating(data) {
    $scope.certificationRating = data.certification_rating;
  }
  
  $scope.launchVideoPlayerModal = function() {
    $state.go('modal.videoplayer', {data:$scope.card});
  };

  getModalDetails();

  // TO-DO: Move everything from function detailsLink() to here
  // detailsLink($scope, null, null, $timeout, null )
});