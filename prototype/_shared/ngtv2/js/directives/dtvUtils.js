(function(angular) {
'use strict';

var app = angular.module('dtv.utils', []);
app.directive('ngRepeatDone', ['$timeout', '$rootScope',
  function($timeout, $rootScope) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        if($scope.$last) {
          setTimeout(function(){
            $rootScope.$broadcast('ngRepeatDone', { id: $attr.ngRepeatDone });
          })
        }
      }
    };
  }
]);


})(window.angular);