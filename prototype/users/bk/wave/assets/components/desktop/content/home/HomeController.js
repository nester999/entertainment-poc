var homeResolve = {
  carousels: ['$dtvApi',
    function($dtvApi) {
      return $dtvApi.getCarousels();
    }
  ]
};

desktop.controller('HomeController', function($scope, $state, carousels, $dtvApi){

  // TO-DO: RESOVLE makes controller clean and lean but kinda slow and errors happen in no man's land
  // This might be better
  // $dtvApi.getCarousels().then(function(data){
  //   $scope.carousels = data;
  // })




  $scope.carousels = carousels;
  $scope.layout = 'carousel';

  //TO-DO: launching details modal should be handled by asset card directive or list directive
  $scope.viewDetailsModal = function(card, carousel){
    var data = {
      card: card,
      carousel: carousel
    };

    $state.go('modal.details', {data:data, media_type: card.media_type, id: card.id});
  }
});

