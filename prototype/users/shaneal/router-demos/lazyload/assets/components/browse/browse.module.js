angular.module('BrowseModule', [])
  .config(['$stateProvider', function($stateProvider) {

    console.log('LOADED BROWSE-MODULE');

    var browseCarousel = {
      name: 'home.movies',
      url: 'movies',
      // resolve: {
      //   carousels: function(BrowseService) { // Movies gets injected inside MoviesCtrl
      //     return BrowseService.getCarousels();
      //   }
      // },
      views: {
        'dtv-tup@': {
          controller: function($scope) {},
          templateUrl: 'assets/components/browse/movies/movies.html'
        }
      }
    };
    $stateProvider.state(browseCarousel);
  }]);