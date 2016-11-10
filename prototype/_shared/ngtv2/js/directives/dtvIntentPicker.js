(function(TweenMax) {

angular.module('dtv.intentPicker', [])
.directive('dtvIntentPicker', ['$compile', '$parse', '$state', '$stateParams', '$dtvIntent', '$timeout', function($compile, $parse, $state, $stateParams, $dtvIntent, $timeout) {
  return {
    restrict: 'AE',
    templateUrl: '/_shared/ngtv2/templates/dtvIntentPicker.html',
    scope: {
      platform : '@',
      animationType: '@'
    },
    link: function(scope, element, attr) {
      scope.intentItems = $dtvIntent.get(scope.platform);
      scope.intent = {
        style: {}
      };
      scope.intentPill = {
        style: {} 
      };
      
      scope.currentIntentIndex = 0;

      scope.numOptions = scope.intentItems.length;
      scope.pillWidth = (100 / scope.numOptions);
      var transitionProperty = '';

      switch(scope.animationType) {
        case 'slide':
          transitionProperty = '0.7s cubic-bezier(1,.01,.33,1.14)';
          break;
        case 'quick':
          transitionProperty = '0.3s ease';
          break;
        default: 
          transitionProperty = '0s';
      }

      scope.intentPill.style = {
        transition: transitionProperty,
        display: (scope.platform === 'desktop') ? 'none' : '',
        width: (scope.pillWidth - 4) + "%"
      };
      
      scope.intentChanged = function(index) {          
        $timeout(function() {
          if(scope.currentIntentIndex === index) { return; }
          scope.currentIntentIndex = index;
        }, 50);
        
        angular.forEach(scope.intentItems, function(intentItem, i) {
          if(i == index) {
            intentItem.active = true;
            scope.intentPill.style = {
              width: (scope.pillWidth - 4) + "%",
              left: (i * scope.pillWidth) + "%",
              transition: transitionProperty
            };

            if(intentItem.theme) 
              $('html').addClass('dark-theme');
            else 
              $('html').removeClass('dark-theme');
          } else {
            intentItem.active = false;
          }
        });
      };
    }
  };
}])

.service('$dtvIntent', ['$location', '$stateParams', '$state',
  function($location, $stateParams, $state) {
    
    var data = {};

    data.mobile = [
      {
        label: 'Browse for TV',
        iconClass: 'cast',
        active: false,
        queryParam: 'tv'
      },
      {
        label: 'Watch Online',
        iconClass: 'play-o',
        active: false,
        queryParam: 'online',
        theme: 'dark-theme'
      }// ,
      // {
      //   label: 'Google Glass',
      //   iconClass: 'look',
      //   active: false,
      //   queryParam: 'cast',
      // }
    ];

    data.desktop = [
      {
        label: 'Browse for TV',
        iconClass: 'cast',
        active: true,
        queryParam: 'tv'
      },
      {
        label: 'Watch Online',
        iconClass: 'play-o',
        active: false,
        queryParam: 'online',
        theme: 'dark-theme'
      }
    ];

    this.get = function(api) {
      return data[api];
    };

    // this.setItem = function(key, index);



    this.setItem = function(item) {
      for(var i = 0; i < this.items.length; i++) {
        if(angular.equals(item, this.items[i])) {
          this.items[i].active = true;
          // $state.go('base', 
          //   { watch: this.items[i].queryParam }, 
          //   { notify: false }
          // );
          if(this.items[i].theme) {
            $('html').addClass('dark-theme');
          } else {
            $('html').removeClass('dark-theme');
          }
        } else {
          this.items[i].active = false;
        }
      }
    };

    // if($stateParams.watch === 'tv') {
    //   this.setItem(this.items[0]);
    // } else if(!$stateParams.watch || $stateParams.watch === 'online') {
    //   this.setItem(this.items[1]);
    // }
    // else if($stateParams.watch === 'glass') {
    //   this.setItem(this.items[2]);
    // }
  }
]);

})();