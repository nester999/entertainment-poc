ngtvApp.controller('BaseModalController', 
  function($scope, $state, $stateParams) {
    $scope.close = function() {
      $('body, html').css('overflow', '');
      $state.go('app');
    };
  }
);