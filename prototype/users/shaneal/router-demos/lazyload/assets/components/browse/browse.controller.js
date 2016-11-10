angular.module('dtv.browseCtrl', [])
  .controller('BrowseCtrl', 
    ['$scope', 'BrowseService', function($scope, BrowseService) {
      console.log('WHAT THEW F');

      BrowseService.getBrowse().then(function(carousels) {
        $scope.carousels = carousels;
      });

    }]);