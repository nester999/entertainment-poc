angular.module('dtv.service', []).
  service('BrowseService', ['$http', '$q', function($http, $q) {
    var baseUrl = 'http://api.themoviedb.org/3/';
    var imagesUrl = 'http://image.tmdb.org/t/p/w300';
    var apiKey = 'ecda3228e70942921f2177da1ff9ba5d';

    console.log('ITS RUNNING MAN');

    return {
      getBrowse: function() {
        var deferred = $q.defer();
        $http.get('/_shared/ngtv2/data.json')
          .success(function(data) {
            deferred.resolve(data);
         }).error(function(msg) {
           deferred.reject(msg);
         });
        return deferred.promise;
      },
      getMovies: function() {
        var deferred = $q.defer();
        $http.get('/_shared/ngtv2/data.json')
          .success(function(data) {
            deferred.resolve(data);
         }).error(function(msg) {
           deferred.reject(msg);
         });
        return deferred.promise;        
      },
      getShows: function() {
        var deferred = $q.defer();
        $http.get('/_shared/ngtv2/data.json')
          .success(function(data) {
            deferred.resolve(data);
         }).error(function(msg) {
           deferred.reject(msg);
         });
        return deferred.promise;        
      },
      getMovie: function(data) {
        var apiUrl = baseUrl + 'movie/' + data.id + '?api_key=' + apiKey;
        return $http.get(apiUrl);
      }
    };
  }]);