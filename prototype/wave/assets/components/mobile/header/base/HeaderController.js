mobileApp.controller('mobile.HeaderController', ['$scope', '$stateParams',
  function($scope, $stateParams) {

    $scope.intentPlatform = 'mobile';
    $scope.animationType = 'slide';



    // $dtvIntentPicker.get('mobile')
    // return intent for mobile



    //setitem




    // $scope.$watch(function () { return $dtvIntentPicker.items; },
    //   function(value) {
    //     // var data = angular.copy(value);
    //     // data.reverse();
    //     console
    //     $scope.intentItems = value;

    //     console.log('fiugeriufg', value);

    //     // for(var i = 0; i < data.length; i++) {
    //     //   if(data[i].active) {
    //     //     $scope.currentIntent = data[i];
    //     //     return false;
    //     //   }
    //     // }
    //   }, true
    // );

    // $scope.intentChanged = function(item) {
    //   $dtvIntentPicker.setItem(item);
    // };


  }
]);