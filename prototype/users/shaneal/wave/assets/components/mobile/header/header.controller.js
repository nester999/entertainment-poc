dtvModule.controller('HeaderCtrl', ['$scope', '$stateParams', '$dtvIntent',
  function($scope, $stateParams, $dtvIntent) {
    $scope.$watch(function () { return $dtvIntent.items; },
      function(value) {
        var data = angular.copy(value);
        data.reverse();
        $scope.intentItems = data;

        for(var i = 0; i < data.length; i++) {
          if(data[i].active) {
            $scope.currentIntent = data[i];
            return false;
          }
        }
      }, true
    );

    $scope.intentChanged = function(item) {
      $dtvIntent.setItem(item);
    };

  }
]);