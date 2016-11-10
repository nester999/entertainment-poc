dtvModule.service('$dtvModal', [
  function() {
    this.data = {};
    this.setModal = function(data) {
      if(!data) { return; }
      this.data = data;
    };

    this.close = function() {
      this.data = {};
    };
  }
]);

dtvModule.directive('dtvModal', ['$dtvModal', '$rootScope', '$timeout',
  function($dtvModal, $rootScope, $timeout) {
    return {
      template: '<div ng-include="templateUrl"></div>',
      link: function($scope, $element, $attr) {
        $scope.$watch(function () { return $dtvModal.data; },
          function(value) {
            $scope.active = true;
            $scope.type = value.type;
            $scope.ngModel = value.data;
            switch(value.type) {
              case 'videoPlayer':
                $scope.templateUrl = 'assets/js/directives/modal/videoPlayerTemplate.html';
                videoPlayerLink($scope, $element, $attr, $timeout, $dtvModal);
                break; 
              case 'details':
                $scope.templateUrl = 'assets/js/directives/modal/seriesDetailsModalTemplate.html';
                detailsLink($scope, $element, $attr, $rootScope, $dtvModal);
                break;
              case 'detailsTablet':
                $scope.templateUrl = 'assets/js/directives/modal/dtvModalDetailsTabletTemplate.html';
                detailsTabletLink($scope, $element, $attr, $http, $dtvModal);
                break;
              default:
                $scope.active = false;
                $scope.templateUrl = '';
                $scope.ngModel = null;
            }
          }
        );
      }
    };
  }
]);