(function() {

angular.module('dtv.background', [])

.directive('dtvBackgroundCover', ['$parse', function($parse) {
  return {
    restrict: 'AE',
    link: function(scope, element, attr) {
      element.addClass('dtv-background-cover');

      var img = new Image();
      img.src = (attr.src && attr.src.indexOf('http') === 0) ? attr.src : $parse(attr.src)(scope);
      img.onload = imageLoaded;

      function imageLoaded() {
        element.css('background-image', 'url(' + img.src + ')');
        element.addClass('loaded');
      }
    }
  };
}])

.directive('dtvBackgroundContain', ['$parse', function($parse) {
  return {
    restrict: 'AE',
    link: function(scope, element, attr) {
      element.addClass('dtv-background-contain');

      var img = new Image();
      img.src = (attr.src && attr.src.indexOf('http') === 0) ? attr.src : $parse(attr.src)(scope);
      img.onload = imageLoaded;

      function imageLoaded() {
        element.css('background-image', 'url(' + img.src + ')');
        element.addClass('loaded');
      }
    }
  };
}]);

})();