define([], function() {
  return angular.module("dtv.BrowseService", []).
  service('BrowseService', ['$http', '$q', function($http, $q) {
    var baseUrl = 'http://api.themoviedb.org/3/';
    var imagesUrl = 'http://image.tmdb.org/t/p/w300';
    var apiKey = 'ecda3228e70942921f2177da1ff9ba5d';

    return {
      getCarousels: function() {
        var deferred = $q.defer();
        $http.get('/_shared/ngtv2/data.json')
          .success(function(data) {
            console.log('HELLO', data);
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
});

// .factory('movieService', function($http, $log, $q) {
//   return {
//    getMovie: function(movie) {
//      var deferred = $q.defer();
//      $http.get('/api/v1/movies/' + movie)
//        .success(function(data) { 
//           deferred.resolve({
//              title: data.title,
//              cost: data.price});
//        }).error(function(msg, code) {
//           deferred.reject(msg);
//           $log.error(msg, code);
//        });
//      return deferred.promise;
//    }
//   }
//  });