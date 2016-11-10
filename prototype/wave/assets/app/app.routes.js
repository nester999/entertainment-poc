ngtvApp.config(['$stateProvider', '$stickyStateProvider', '$urlRouterProvider', function($stateProvider, $stickyStateProvider, $urlRouterProvider){
  
  $stateProvider
    .state('app', {
      views: {
        // TO-DO: header can be rendered at server side
        'header': {
          templateUrl: getTemplate('/header/base/HeaderTemplate.html'),
          controller: getController('HeaderController')
        },
        'body': {
          templateUrl: getTemplate('/content/base/BodyTemplate.html')
        },
        // TO-DO: placeholder for footer
        'footer': {
          template: '<div></div>'
        }
      },
      sticky: true,
      dsr: true
    })
    .state('app.entertainment', {
      url: '/',
      views:{
        'hero': {
          templateUrl: getTemplate('/header/hero/HeroTemplate.html'),
          controller: getController('HeroSliderController')
        },
        'content': {
          template: '<div ui-view></div>'
        }
      },
      // TO-DO: resolve make controller clean and lean but kinda slow and errors happen in no man's land
      deepStateRedirect: { default: "app.entertainment.carousel" }
    })
    .state('app.entertainment.carousel', {
      templateUrl: getTemplate('/content/home/HomeTemplate.html'),
      controller: getController('HomeController')
    })
    .state('app.entertainment.grid', {
      // TO-DO: ui-router reload when there are params passed..try not to reload on closing modal
      url:'carousel/:id',
      templateUrl: getTemplate('/content/grid/GridTemplate.html'),
      controller: getController('GridViewController')
    });
    // .state('app.browse', {
    //   // url:'entertainment',
    //   views:{
    //     'hero': {
    //       templateUrl: 'assets/components/'+$env.platform+'/header/hero/HeroTemplate.html',
    //       controller: 'HeroSliderController'
    //     },
    //     'content': {
    //       templateUrl: 'assets/components/'+$env.platform+'/content/browse/BrowseTemplate.html',
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
      views: {
        'modal': {
          templateUrl: 'assets/components/common/modal/base/BaseModalTemplate.html',
          controller: 'BaseModalController'
        }
      }
    })
    .state('modal.details', {
      url: '/:media_type/:id',
      templateUrl: function($stateParams) {
        // TO-DO: different template can be picked based on media type
        // TO-DO: this is temp separation. come up with better way to branch bet. platform
        var type = chooseMediaType($stateParams);
        return getTemplate('/modal/details/' + type + 'ModalTemplate.html');
      },
      controllerProvider: function($stateParams){
        //TO-DO: come up with better way to branch bet. platform
        var type = chooseMediaType($stateParams);
        return getController(type + 'ModalController');
      },
      params:{
        data: null,
        media_type: null,
        id: null
      }
    })
    .state('modal.videoplayer', {
      // url:'/videoplayer',
      // templateUrl: getTemplate('/modal/videoplayer/VideoPlayerModalTemplate.html'),
      // For now VideoPlayer is same on desktop/mobile
      templateUrl: 'assets/components/common/modal/videoplayer/VideoPlayerModalTemplate.html',
      controller: 'VideoPlayerController',
      params:{
        data: null
      }
    });

  // format media type to match capitalized camel case of modal controller names
  function chooseMediaType($stateParams) {
    var type = ($stateParams.media_type === 'show') ? 'show' : $stateParams.media_type;
    type = ($stateParams.media_type === 'genre') ? 'show' : type;
    type = _.camelCase(type);
    type = _.capitalize(type);

    return type;
  }

  function getController(ctrlName) {
    // TO-DO: implement js file lazyloading (oc.lazyLoad)
    return $env.platform + '.' + ctrlName;
  }

  function getTemplate(tmpName){
    return 'assets/components/'+$env.platform+tmpName;
  }
  // $stickyStateProvider.enableDebug(true);
}]);