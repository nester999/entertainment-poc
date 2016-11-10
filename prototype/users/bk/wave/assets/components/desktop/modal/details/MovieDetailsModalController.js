desktop.controller('movieDetailsController', function($scope, $state, $stateParams, $previousState){
  console.log($stateParams);
  var card = $stateParams.data.card;
  
  $scope.active = true;
  $scope.modal = {
    style: {
      backgroundImage: 'url(' + card.backdrop_path.replace('/w500', '/w1920') + ')',
      backgroundRepeat: 'no-repeat'
    }
  };

  $scope.closeModal = function(){
    $state.go('app');
  };
  
  $scope.launchVideoPlayerModal = function() {
    $state.go('modal.videoplayer', {data:$stateParams.data});
  };

  // TO-DO: Move everything from function detailsLink() to here
  //detailsLink($scope, null, null, $timeout, null )
});