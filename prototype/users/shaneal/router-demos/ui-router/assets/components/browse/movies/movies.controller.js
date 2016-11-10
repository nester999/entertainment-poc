define([], function() {
  return ['$scope', 'carousels', function($scope, carousels) {
    $scope.carousels = carousels;
    console.log(carousels);
  }];
});