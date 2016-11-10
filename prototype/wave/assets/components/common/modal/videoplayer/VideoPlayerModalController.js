ngtvApp.controller('VideoPlayerController', function($scope, $state, $timeout, $stateParams, $previousState, $dtvApi){

  var data = $stateParams.data;
  $scope.active = true;

  $scope.ngModel = {};
  $scope.video = data.card;

  $dtvApi.getCarousels().then(function(data) {
    $scope.ngModel.nav = data;

  // TO-DO: Move everything from function videoPlayerLink() to here
  videoPlayerLink($scope, null, null, $timeout, null );
  });

  $scope.closeVideoPlayer = function(){
   $previousState.go();
  };
  
  
});