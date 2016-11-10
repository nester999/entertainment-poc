dtvModule.service('$dtvIntent', ['$location', '$stateParams', '$state',
  function($location, $stateParams, $state) {
    this.items = [
      {
        label: 'Browse for Tv',
        iconClass: 'cast',
        active: false,
        queryParam: 'tv',
        theme: 'dark-theme'
      },
      {
        label: 'Watch Online',
        iconClass: 'play-o',
        active: false,
        queryParam: 'online',
      }
    ];

    this.setItem = function(item) {
      for(var i = 0; i < this.items.length; i++) {
        if(angular.equals(item, this.items[i])) {
          this.items[i].active = true;
          $state.go('base', 
            { watch: this.items[i].queryParam }, 
            { notify: false }
          );
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

    if($stateParams.watch === 'tv') {
      this.setItem(this.items[0]);
    } else if(!$stateParams.watch || $stateParams.watch === 'online') {
      this.setItem(this.items[1]);
    }
  }
]);