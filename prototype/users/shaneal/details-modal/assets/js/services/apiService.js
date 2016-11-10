(function(angular) {
'use strict';

angular.module('dtv.api', [])

.service('$dtvApi', ['$http', '$q', function($http, $q) {
  this.getCarousels = function() {
    var defer = $q.defer();
    $http.get('data/modal-data.json')
      .success(function(data) {
        console.log(data);
        defer.resolve(data);
      })
      .error(function(msg) {
        defer.reject(msg);
      });
    return defer.promise;
  };
  this.getEpisodes = function(episodeId) {
    var defer = $q.defer();
    $http.get('data/' + episodeId + '-seasons.json')
      .success(function(data) {
        console.log(data);
        defer.resolve(data);
      })
      .error(function(msg) {
        defer.reject(msg);
      });
    return defer.promise;
  };
  this.getClips = function() {
    var defer = $q.defer();
    $http.get('data/clips.json')
      .success(function(data) {
        console.log(data);
        defer.resolve(data);
      })
      .error(function(msg) {
        defer.reject(msg);
      });
    return defer.promise;
  };
}]);

})(window.angular);