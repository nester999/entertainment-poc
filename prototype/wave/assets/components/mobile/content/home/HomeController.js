mobileApp.controller('mobile.HomeController', ['$scope', '$state', '$dtvApi',
  function($scope, $state, $dtvApi) {
    $dtvApi.getCarousels().then(function(data){
      $scope.carousels = data;
    });

    $scope.layout = 'stackView';
  }
]);