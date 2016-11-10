var gridResolve = {
  carousel: ['$stateParams', 'carousels', '$dtvApi', 
    function($stateParams, carousels, $dtvApi) {
      return $dtvApi.getCarousel(carousels, $stateParams.id);
    }
  ]
};


desktop.controller('GridViewController', function($scope, $state, carousel, $stateParams){
  // console.log('--- grid --');
  // console.log(carousel);
  // console.log($stateParams);
  $scope.carousel = carousel;
  $scope.breakPoints = [
    {maxWidth: 400,  columns:1, spacingX: 0  },
    {maxWidth: 1000, columns:3, spacingX: 20 },
    {maxWidth: 1500, columns:4, spacingX: 20 },
    {maxWidth: 3000, columns:5, spacingX: 20 }
  ];
  $scope.layout = 'grid';

  $scope.viewDetailsModal = function(card, carousel){
    var data = { card: card, carousel: carousel};
    $state.go('modal.details', {data:data, media_type: card.media_type, id: card.id});
  }
});