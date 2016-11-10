(function(TweenMax) {

angular.module('dtv.startWatching', [])
.directive('dtvStartWatching', ['$compile', '$parse', '$state', '$stateParams', function($compile, $parse, $state, $stateParams) {
  return {
    restrict: 'AE',
    template: '<ng-include src="getTemplateUrl()"/>',
    // template: '<div ng-include="::templateUrl" class="card-template-tup"></div>',

    controller: function($scope) {
      //function used on the ng-include to resolve the template
      $scope.getTemplateUrl = function() {
        var templatePath = '/_shared/ngtv2/components/start-watching/';
        // use textless start watching button if media type is one of the following shows
        // TO-DO: can't fake media_type in app.routes here, so test with actual clip cards
        if(_.indexOf(['movie','clip', 'music'], $stateParams.media_type) !== -1) {
          return templatePath + 'start-watching-no-content.html';
        }
        else {
          return templatePath + 'dtvStartWatching.html';
        }
      };
    },
    link: function(scope, element, attr) {

    }
  };
}]);
})();