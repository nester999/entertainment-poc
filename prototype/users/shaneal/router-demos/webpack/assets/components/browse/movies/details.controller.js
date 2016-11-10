define(['BrowseService'], function() {
  return ['$stateParams', '$state', '$modal', 'BrowseService',
    function($stateParams, $state, $modal, BrowseService) {
      $modal.open({
        templateUrl: "assets/components/browse/movies/details.html",
        controller: ['$scope', function($scope, item) {
          BrowseService.getMovie($stateParams).success(success);
          function success(data) {
            $scope.movieData = data;
          }

          $scope.dismiss = function() {
            $scope.$dismiss();
          };

          $scope.save = function() {
            item.update().then(function() {
              $scope.$close(true);
            });
          };
        }]
      }).result.finally(function() {
        $state.go('^');
      });
    }];
});