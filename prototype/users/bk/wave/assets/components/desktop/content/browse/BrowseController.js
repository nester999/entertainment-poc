desktop.controller('BrowseController', function($scope, $state, $stateParams, carousels){

  $scope.carousels = carousels;
  $scope.layout = 'carousel';

  //TO-DO: launching details modal should be handled by asset card directive or list directive
  $scope.viewDetailsModal = function(card, carousel){
    var data = {
      card: card,
      carousel: carousel
    };
    $state.go('modal.details', {data:data})
  }
});