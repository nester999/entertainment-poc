(function() {

angular.module('dtv.assetCard', [])
.directive('dtvAssetCard', ['$compile', '$parse', '$state', function($compile, $parse, $state) {
  return {
    restrict: 'AE',
    scope: {
      data: '='
    },
    template: '<div ng-include="::templateUrl" class="card-template-tup"></div>',
    link: function(scope, element, attr) {
      element.addClass('dtv-asset-card');

      var data = scope.data;
      var templatePath = '/_shared/ngtv2/components/asset-card/';
      scope.class = [];

      if(!data) { return; }

      scope.id = data.id;

      // Add mediatype class to parent dive
      if(data.media_type) {
        scope.class.push(data.media_type);
        scope.mediaType = data.media_type;
      }

      // Add card_type class to parent dive
      if(data.card_type) {
        scope.class.push(data.card_type);
        scope.cardType = data.card_type;
      }

      // Layout type
      if(data.media_type === 'movie') {
        if(data.card_type !== 'in-progress') {
          scope.class.push('portrait');
          scope.templateUrl = templatePath + 'card-portrait.html';
          scope.imgSrc = data.poster_path;
        } else {
          scope.templateUrl = templatePath + 'card-landscape.html';
          scope.imgSrc = data.backdrop_path;
        }

        scope.summary = data.description;
        scope.tomatoScore = data.tomato_score;
      } else if(data.media_type === 'actor-personality') {
        scope.name = data.name;
        scope.title = data.title;
        scope.templateUrl = templatePath + 'card-actor.html';
        scope.imgSrc = data.poster_path;
        scope.metadata = data.metadata;
        scope.class.push('portrait');
      } else if (data.media_type === 'genre' ) {
        scope.genreType = data.name;
        scope.templateUrl = templatePath + 'card-genre.html';
      } else {
        scope.templateUrl = templatePath + 'card-landscape.html';
      }

      if(data.media_type === 'show') {
        if(data.card_type === 'in-progress') {
          scope.hashTag = data.caption_tag;
        } else {
          scope.isNotSubscribed = !data.subscribed;
        }
      } else {
        scope.isNotSubscribed = false;
      }

      switch(data.card_type) {
        case 'recomendation':
          scope.recomendedBy = data.recomended_by;
          break;
        case 'following':
          scope.hashTag = data.hash_tag;
          break;
        case 'in-progress':
          scope.time = getTime(data.media_position) + '/ ' + getTime(data.media_duration);
          scope.progress = (data.media_position / data.media_duration) * 100;
          break;
      }

      if((data.media_type === 'clip' || data.media_type === 'music-video') && data.card_type !== 'in-progress') {
        scope.time = getTime(data.media_duration);
        scope.progress = 0;
      }

      if(data.media_type === 'live-content') {
        scope.time = 'live';
        scope.progress = 0;
        if(data.card_type !== 'recomendation') {
          scope.channelLogo = data.channel_logo;
        }
      }

      if(data.media_type !== "actor-personality") {
        scope.programTitle = data.title;
      }

      // Fix this to add fallback for landscape & portrait
      if(data.media_type !== 'movie' && data.media_type !== 'actor-personality') {
        scope.imgSrc = data.backdrop_path;
        scope.description = data.description;
      }

      if(data.media_type === 'movie' || (data.media_type === 'sporting-event') && data.card_type === '') {
        scope.ppv = data.ppv;
      }

      // Clean this up
      function getTime(t) {
        var time = '';
        var d = new Date(0,0,0,0,0,0, t);
        if(d.getHours() > 0) {
          time = d.getHours() + ':';
        }
        time += (d.getMinutes() < 10 && d.getHours() !== 0) ? ':0' + d.getMinutes() : d.getMinutes() + ':';
        time += (d.getSeconds() < 10 && d.getHours() !== 0) ? ':0' + d.getSeconds() : d.getSeconds();
        time = time.replace('::', ':');
        return time;
      }
    }
  };
}]);

})();

