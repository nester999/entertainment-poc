var app = angular.module('demoApp', []);

app.controller('demoAppCtrl', ['$http','$scope', function($http, $scope){

  $http.get('/users/infy/ngtv-demo/_shared/moviesStubData.json').success(function(data){
    $scope.moviesData = data;
  });

}]);