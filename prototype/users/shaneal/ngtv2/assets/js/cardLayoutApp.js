var app = angular.module('dtvApp', ['dtv.background', 'dtv.assetCard', 'dtv.cardLayout']);

app.controller('AppCtrl', ['$scope', '$http', '$document',
  function($scope, $http, $document) {
    // $http.get("/_shared/ngtv2/data.json")
    // .success(function(data) {
    //   $scope.data = data;
    //   // console.log(data);
    // });

    $scope.clicked = function() {
      if($scope.layout === 'carousel') {
        $scope.layout = 'grid';
      } else {
        $scope.layout = 'carousel';
      }
    };
  }
]);