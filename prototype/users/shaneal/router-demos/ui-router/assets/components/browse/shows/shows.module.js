define([],
  function() {
    var browseCarousel = {
      name: 'home.shows',
      url: 'shows',
      // resolve: {
      //   data: loadMe
      // },
      views: {
        'dtv-tup@': {
          template: '<div>{{message}}</div>',
          controller: function($scope) {
            $scope.message = 'jaime baby FA SHOW';
          }
        }
      }
    };
    
    var app = angular.module("dtvShows", []);
    app.config(['$stateProvider', function ($stateProvider) {
      $stateProvider.state(browseCarousel);
    }]);
    
    return { mainState: browseCarousel, module: app };
});