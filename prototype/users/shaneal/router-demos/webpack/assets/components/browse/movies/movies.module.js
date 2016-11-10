define(['MoviesCtrl', 'BrowseService', 'DetailsController'], 
  function(MoviesCtrl, BrowseService, DetailsController) {
    var browseCarousel = {
      name: 'home.movies',
      url: 'movies',
      resolve: {
        carousels: function(BrowseService) { // Movies gets injected inside MoviesCtrl
          return BrowseService.getCarousels();
        }
      },
      views: {
        'dtv-tup@': {
          controller: MoviesCtrl,
          templateUrl: 'assets/components/browse/movies/movies.html'
        }
      }
    };

    var movieModal = {
      name: 'home.movies.detail',
      url: '/:id',
      onEnter: DetailsController
    };
    
    var app = angular.module("dtvMovies", []);
    app.config(['$stateProvider', function ($stateProvider) {
      $stateProvider.state(browseCarousel);
      $stateProvider.state(movieModal);
    }]);
    
    return { mainState: browseCarousel, module: app };
});