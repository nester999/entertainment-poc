dtvModule.controller('HomeCtrl', ['$scope', '$state', 'carousels', '$location',
  function($scope, $state, carousels, $location) {
    $scope.carousels = carousels;
    $scope.layout = 'carousel';

    $scope.gridView = function(url) {
      console.log('-----');
      $state.go('base.carousel', { id: url });
      $location.path('tv/shaneal');
    };
  }
]);