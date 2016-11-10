desktop.controller('desktop.HeaderController', function($scope, $dtvIntent){
  $scope.intentPlatform = 'desktop';
  $scope.animationType = 'slide';
  
  $scope.$watch(function () { return $dtvIntent.items; },
    function(value) {
      $scope.intentItems = value;
    }, true
  );

  $scope.intentChanged = function(item) {
    $dtvIntent.setItem(item);
  };
});