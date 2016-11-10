(function(angular, $) {

var app = angular.module('dtv.env', []);

app.provider('$dtvEnv', [
  function() {
    var isMobile = false;
    var isDesktop = false;

    var homeResolve = {
      carousels: ['$dtvApi',
        function($dtvApi) {
          return $dtvApi.getCarousels();
        }
      ]
    };

    var gridResolve = {
      carousel: ['$stateParams', 'carousels', '$dtvApi', 
        function($stateParams, carousels, $dtvApi) {
          return $dtvApi.getCarousel(carousels, $stateParams.id);
        }
      ]
    };

    var desktopStates = [
      {
        url: '/?watch',
        name: 'base',
        resolve: homeResolve,
        views: {
          'header@': {
            templateUrl: 'assets/components/desktop/header/header.html',
            controller: 'HeaderCtrl'
          },
          'body@': {
            templateUrl: 'assets/components/desktop/home/home.html',
            controller: 'HomeCtrl'
          }
        }
      },
      {
        // url: 'carousel/:id',
        name: 'base.carousel',
        resolve: gridResolve,
        onEnter: ['$state',
          function($state) {

          }
        ],
        onExit: ['$state',
          function($state) {

          }
        ],
        views: {
          // 'body@': {
          //   templateUrl: 'assets/components/desktop/home/grid/grid.html',
          //   controller: 'GridCtrl'
          // }
          'carousel@base': {
            template: '<h1>hello</div>',
            controller: function() {
              console.log('laodedctrl');
            }
          }
        }
      }
    ];

    var mobileStates = [
      {
        url: '/?watch',
        name: 'base',
        resolve: homeResolve,
        views: {
          'header@': {
            templateUrl: 'assets/components/mobile/header/header.html',
            controller: 'HeaderCtrl'
          },
          'body@': {
            templateUrl: 'assets/components/mobile/home/home.html',
            controller: 'HomeCtrl'
          }
        }
      }
    ];

    this.getStates = function() {
      isDesktop = $('body').hasClass('desktop');
      isMobile = !isDesktop;

      if(isDesktop) {
        return desktopStates;
      } else {
        return mobileStates;
      }
    };

    this.$get = function() {
      return {
        isMobile:  function() { return isMobile; },
        isDesktop: function() { return isDesktop; }
      };
    };
  }
]);

})(window.angular, window.jQuery);