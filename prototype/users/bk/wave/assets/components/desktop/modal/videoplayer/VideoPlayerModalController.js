desktop.controller('VideoPlayerController', function($scope, $state, $timeout, $stateParams, $previousState){

  var data = $stateParams.data;
  $scope.active = true;
  $scope.ngModel = {nav: data.carousel};
  $scope.video = data.card;

  $scope.closeVideoPlayer = function(){
   $previousState.go();
  }
  
  // TO-DO: Move everything from function videoPlayerLink() to here
  videoPlayerLink($scope, null, null, $timeout, null );
});