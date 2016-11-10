desktop.controller('desktop.HomeController', function($scope, $state, $dtvApi, $http){
  $scope.continueWatchingCarouselLayout = 'carousel';
  $scope.continueWatchingCarouselLayoutBreakPoints = [
    {maxWidth: 400,  columns:1, spacingX: 0  },
    {maxWidth: 1000, columns:3, spacingX: 20 },
    {maxWidth: 1500, columns:4, spacingX: 20 },
    {maxWidth: 3000, columns:5, spacingX: 20 }
  ];

  // This might be better
    $dtvApi.getCarousels().then(function(data){
    $scope.carousels = data;
    $scope.continueWatchingCarousel = data[0];
  });

  $http.get('/_shared/ngtv2/livestreaming.json').success(function(data) {
    $scope.livestreamingCarousel = data;
  }).error(function(msg) {
    console.log('error: ' + msg);
  });

  $http.get('/_shared/ngtv2/favoriteChannels.json').success(function(data) {
    $scope.livestreamingCarouselFavorites = data.results;
  }).error(function(msg) {
    console.log('error: ' + msg);
  });

  $scope.limitToCount = 2;
  $scope.layout = 'carousel';
  
  $scope.selectFavoriteChannel = function(channel) {
    channel.currently_playing.media_type = "live-content";
    $scope.livestreamingCarousel[0].items[0] = channel.currently_playing;
  }

  // TO-DO: this is fake lazy loading carousel for POC. make initial load faster
  setTimeout(function(){
    $scope.limitToCount = 4;
    $scope.$digest();
  },500);

  setTimeout(function(){
    $scope.limitToCount = $scope.carousels.length;
    $scope.$digest();
  },1000);
});

