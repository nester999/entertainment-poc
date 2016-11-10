require.config({
  // waitSeconds: 100,
  paths: {
    'jquery': '../vendor/jquery/dist/jquery.min',
    'slick-carousel': '../vendor/slick-carousel/slick/slick.min',

    'angular': '../vendor/angular/angular',
    'angularAMD': '../vendor/angularAMD/angularAMD',
    'ngload': '../vendor/angularAMD/ngload',
    'angular-ui-router': '../vendor/angular-ui-router/release/angular-ui-router',
    'angular-bootstrap': '../vendor/angular-bootstrap/ui-bootstrap-tpls.min',
    'ui-router-extras-core': '../vendor/ui-router-extras/release/modular/ct-ui-router-extras.core',
    // 'ui-router-extras-statevis': '../../lib/modular/ct-ui-router-extras.statevis',
    // 'ui-router-extras-sticky': '../../lib/modular/ct-ui-router-extras.sticky',
    'ui-router-extras-future': '../vendor/ui-router-extras/release/modular/ct-ui-router-extras.future',

    'angular-slick': '../vendor/angular-slick/dist/slick.min',
    'themoviedb': '../vendor/themoviedb/themoviedb.min',

    // App Files
    'NavCtrl': '../components/nav/nav.controller',

    'movies': '../components/browse/movies/movies.module',
    'shows': '../components/browse/shows/shows.module',

    'MoviesCtrl': '../components/browse/movies/movies.controller',
    'BrowseService': '../components/browse/browse.service',
    'DetailsController': '../components/browse/movies/details.controller',
  },
  shim: {
    'jquery': {exports: '$'},

    'angular': { exports: 'angular' },
    'angularAMD': ['angular'],
    'ngload': ['angularAMD'],
    'angular-ui-router': ['angular'],
    'angular-bootstrap': ['angular'],
    'ui-router-extras-core': ['angular'],
    // 'ui-router-extras-statevis': ['angular', 'ui-router-extras-sticky'],
    // 'ui-router-extras-sticky': ['angular', 'ui-router-extras-core'],
    'ui-router-extras-future': ['angular', 'ui-router-extras-core'],
    'angular-slick': ['angular'],

    // Movies Module
    'movies': ['angular'],
    //Shows Module
    'shows': ['angular']
  },
  map: {
    '*': {
      css: '../vendor/require-css/css'
    }
  },
  deps: ['app']
});