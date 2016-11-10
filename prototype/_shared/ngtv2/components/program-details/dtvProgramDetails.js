(function() {

// angular.module('dtv.animations', [])
// .animation('.tabins', [function() {
//   // setup, start, cancel
//   return {
//     enter: function(element, done) {
//       console.log('HELLfffffffO');
//       // jQuery(element).slideIn(1000, done);
//       TweenMax.to(element, 1, {
//         opacity: 0.1,
//         onComplete: done
//       });

//     },
//     // start: function(element, done) {
//     //   console.log('HELLfffffffO');
//     //   // jQuery(element).slideIn(1000, done);
//     //   TweenMax.to(element, 1, {
//     //     opacity: 0.1
//     //   });
//     // },
//     // setup: function (element) {
//     //   console.log('WHAT THE F');
//     // }
//   };
// }]);

})();

(function(TweenMax) {

angular.module('dtv.programDetails', [])
.directive('dtvProgramDetails', ['$location', '$window', '$rootScope', '$timeout', '$view',
  function($location, $window, $rootScope, $timeout, $view) {
  return {
    restrict: 'AE',
    scope: {
      data: '='
    },
    template: '<div ng-include="templateUrl"></div>',
    link: function(scope, element, attr) {
      var data = scope.data;
      var templatePath = '/_shared/ngtv2/components/program-details/';
      scope.class = ['dtv-program-details'];

      if(!data) { return; }

      // Add mediatype class to parent div
      if(data.media_type) {
        // FIX THIS!!
        if(data.media_type === 'show') {
          scope.class.push('series');
          scope.headerMeta = [
            data.air_dates, 
            data.seasons + ' Seasons, ' + data.episodes + ' Episodes',
            data.genres.join(', '),
            data.rating
          ];

          scope.awards = data.awards;
        } else {
          scope.class.push(data.media_type);
          scope.headerMeta = [
            data.release_date, 
            data.duration,
            data.genres.join(', '),
            data.rating
          ];

          scope.tomatoScore = data.tomato_score;
          scope.flicksterScore = data.flickster_score;
        }

        // Common
        scope.id = data.id;
        scope.programTitle = data.title;
        scope.imgSrc = data.poster_path;
        scope.description = data.description;
        scope.templateUrl = templatePath + data.media_type + '.html';

        // Setup Tabs
        scope.tabs = [
          { 
            title: 'All Episodes',
            href: '/all-episodes/' + data.id,
            active: false
          },
          { 
            title:'Clips',
            href: '/clips/' + data.id,
            active: false
          },
          { title:'Similar Shows',
            href: '/clips/' + data.id,
            active: false 
          }
        ];

        scope.change = function(href) {
          $location.path(href);
          animateContentIn();

          $view.load('1396@modal.episodes', {
            template: '<div>HELLOWORLD</div>'
          });
        };

        scope.close = function() {
          $location.path('/');
          scope.tabs[0].active = false;
          scope.tabs[1].active = false;
          scope.tabs[2].active = false;
          animateContentOut();
        };
      }

      var topNavHeight = 45;
      var h = 559;
      var time = 0.65;
      var containerHeight = 0;
      var tabTop = 0;
      // HACK
    
      function animateContentIn() {
        var container = $('.details', element);
        var tabs = $('.tab-tup', container);
        var arrow = $('.heading a', container);
        var body = $('.body > div:not(.tab-tup)', container);
        var episodeTup = $('.tab-tup > ui-view', container);

        tabTop = tabs.position().top;

        // Modal Contents
        TweenMax.to(body, time, {
          opacity: 0
        });

        // Modal Height
        TweenMax.to(container, time, {
          height: $('#dtv_tup').height() - container.offset().top + topNavHeight,
          ease: Expo.easeOut
        });

        var fuck = false;
        // Tabs slide up Animation
        TweenMax.to(tabs, time, {
          top: 0,
          bottom: 0,
          delay: time - 0.07,
          ease: Expo.easeOut,
          onComplete: function() {
            if(!fuck) {
              var hh = $('.episodes', element).height();
              $('.episodes', element).height(hh);
              episodeTup.height(episodeTup.outerHeight());

              $timeout(function() {
                $rootScope.$broadcast('iScrollRefresh');
              }, 0);
              fuck = true;
            }
          }
        });

        TweenMax.to(arrow, time, {
          opacity: 1,
          ease: Expo.easeOut
        });

        TweenMax.set(episodeTup, {
          opacity: 1,
          ease: Expo.easeOut
        });
      }

      function animateContentOut() {
        var container = $('.details', element);
        var tabs = $('.tab-tup', container);
        var arrow = $('.heading a', container);
        var body = $('.body > div:not(.tab-tup)', container);
        var episodeTup = $('.tab-tup > ui-view', container);

        TweenMax.to(container, time, {
          height: h,
          ease: Expo.easeOut
        });

        TweenMax.to(tabs, time, {
          top: tabTop,
          delay: time,
          ease: Expo.easeOut
        });

        TweenMax.to(body, time, {
          opacity: 1,
          delay: time,
          ease: Expo.easeOut
        });

        TweenMax.to(arrow, time, {
          opacity: 0,
          ease: Expo.easeOut
        });

        TweenMax.to(episodeTup, time, {
          opacity: 0,
          ease: Expo.easeOut
        });
      }
    }
  };
}]);

})(window.TweenMax);

