ngtvApp.config(['$stateProvider', '$stickyStateProvider', '$urlRouterProvider', function($stateProvider, $stickyStateProvider, $urlRouterProvider){
  // $urlRouterProvider.rule(function ($injector, $location) {
  // });

  $stateProvider
    .state('app', {
      // url:'/',
      views: {
        // TO-DO: header can be rendered at server side
        'header': {
          templateUrl: 'assets/components/'+$env.deviceType+'/header/base/HeaderTemplate.html',
          controller: 'HeaderController'
        },
        'body': {
          templateUrl: 'assets/components/'+$env.deviceType+'/content/base/BodyTemplate.html'
        },
        // TO-DO: placeholder for footer
        'footer': {
          templateUrl: ''
        }
      },
      sticky: true,
      dsr: true
    })
    .state('app.entertainment', {
      url: '/',
      views:{
        'hero': {
          templateUrl: 'assets/components/'+$env.deviceType+'/header/hero/HeroTemplate.html',
          controller: 'HeroSliderController'
        },
        'content': {
          template: '<div ui-view></div>'
        }
      },
      // TO-DO: resolve make controller clean and lean but kinda slow and errors happen in no man's land
      resolve: homeResolve,
      deepStateRedirect: { default: "app.entertainment.carousel" }
    })
    .state('app.entertainment.carousel', {
      // url:'entertainment',
      templateUrl: 'assets/components/'+$env.deviceType+'/content/home/HomeTemplate.html',
      controller: 'HomeController'
    })
    .state('app.entertainment.grid', {
      // TO-DO: ui-router reload when there are params passed..try not to reload on closing modal
      url:'carousel/:id',
      templateUrl: 'assets/components/'+$env.deviceType+'/content/grid/GridTemplate.html',
      controller: 'GridViewController',
      resolve: gridResolve
    })
    // .state('app.browse', {
    //   // url:'entertainment',
    //   views:{
    //     'hero': {
    //       templateUrl: 'assets/components/'+$env.deviceType+'/header/hero/HeroTemplate.html',
    //       controller: 'HeroSliderController'
    //     },
    //     'content': {
    //       templateUrl: 'assets/components/'+$env.deviceType+'/content/browse/BrowseTemplate.html',
    //       controller: 'HomeController',
    //       resolve: homeResolve
    //     }
    //   },
    //   params: {
    //     data:null
    //   }
    // });
  

  $stateProvider
    .state('modal', {
      // url:'/modal',
      views: {
        'modal': {
          templateUrl: 'assets/components/'+$env.deviceType+'/modal/base/BaseModalTemplate.html'
        }
      }
    })
    .state('modal.details', {
      url: '/movie/:id',
      // TO-DO: different template can be picked based on media type
      templateUrl: 'assets/components/'+$env.deviceType+'/modal/details/DetailsModalTemplate.html',
      controllerProvider: function($stateParams){
        return 'movie' + 'DetailsController';
      },
      params:{
        data: null,
        media_type: null,
        id: null
      }
    })
    .state('modal.videoplayer', {
      // url:'/videoplayer',
      templateUrl: 'assets/components/'+$env.deviceType+'/modal/videoplayer/VideoPlayerModalTemplate.html',
      controller: 'VideoPlayerController',
      params:{
        data: null
      }
    })

    // $stickyStateProvider.enableDebug(true);
}]);