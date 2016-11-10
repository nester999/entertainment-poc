desktop.controller('HeaderController', function($scope, $dtvIntent){
  $scope.$watch(function () { return $dtvIntent.items; },
    function(value) {
      $scope.intentItems = value;
    }, true
  );

  $scope.intentChanged = function(item) {
    $dtvIntent.setItem(item);
  };
});