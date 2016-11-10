(function(angular) {
'use strict';

var app = angular.module('dtv.api', []);
var apiKey = '?api_key=ecda3228e70942921f2177da1ff9ba5d';
var imgPath = 'https://image.tmdb.org/t/p/';
var baseUrl = 'https://api.themoviedb.org/3/';

// var imgPath = 'https://image.tmdb.org/t/p/';

//rotten tomatoes api
var rottenTomatoApiKey = '&apikey=uxc2rsd95jap7csscrbrr38h';
var rottenTomatoBaseUrl = 'http://api.rottentomatoes.com/api/public/v1.0/';
var rottenTomatoPageLimit = '&page_limit=1&page=1';



app.service('$dtvApi', ['$http', '$q',
  function($http, $q) {
    var ngtvData;

    // Renders carousels from stub data
    this.getCarousels = function() {
      var defer = $q.defer();
      $http.get('/_shared/ngtv2/data.json')
        .success(function(data) {
          ngtvData = data;
          defer.resolve(data);
      })
      .error(function(msg) {
        defer.reject(msg);
      });
      return defer.promise;
    };


    // Gets a specific carousel. requires id
    this.getCarousel = function(id) {
      var defer = $q.defer();
      if(!ngtvData) {
        this.getCarousels().then(function() {
          defer.resolve(getCarousel(id));
        });
      } else {
        defer.resolve(getCarousel(id));
      }
      return defer.promise;
    };

    /**
     * Gets data for the details modal
     *
     * @param {String} ('show', 'movie')
     * @param {Number} Media type id
     * @return {Object}
     *
     */
    this.details = function(type, id) {
      if(type === 'show' || type === "live-content") {
        return showDetails(id);
      } else {
        return movieDetails(id);
      }
    };


    /**
     * Gets backdrops for a media type
     *
     * @param {String} ('show', 'movie')
     * @param {Number} Media type id
     * @return {Object}
     *
     */
    this.backdrops = function(type, id) {
      var _type = (type === 'show') ? 'tv' : 'movie';
      var defer = $q.defer();
      $http.get(baseUrl + _type + '/' + id + '/images' + apiKey)
        .success(function(data) {
          var backdrop = data.backdrops[data.backdrops.length-1];
          //defer.resolve(imgPath + 'w' + backdrop.width + backdrop.file_path);  // too big, too long to load
          defer.resolve(imgPath + 'w1000' + backdrop.file_path);
      })
      .error(function(msg) {
        defer.reject(msg);
      });
      return defer.promise;      
    };


    /**
     * Gets Show Episode data for a defined season
     *
     * @param {Number} id
     * @param {Number} Season Number
     * @return {Object}
     *
     */
    this.seasonInfo = function(id, seasonNumber) {
      var defer = $q.defer();
      $http.get(baseUrl + 'tv/' + id + '/season/' + seasonNumber + apiKey)
        .success(function(data) {
          var _data = {
            id: data.id,
            title: data.name,
            description: data.overview,
            poster_path: imgPath + 'w500' + data.poster_path,
            episodes: function() {
              var _episodes = [];
              angular.forEach(data.episodes, function(episode) {
                var _episode = {
                  title: episode.name,
                  description: episode.overview,
                  episode_number: episode.episode_number,
                  season_number: episode.season_number,
                  duration: 42,
                  still_img: (episode.still_path) ? (imgPath + 'w300' + episode.still_path) : ''
                };
                _episodes.push(_episode);
              });
              return _episodes;
            }()
          };
          defer.resolve(_data);
      })
      .error(function(msg) {
        defer.reject(msg);
      });
      return defer.promise;  
    };

    /**
     * Gets rotten tomato score of movie
     *
     * @param {String} movie title
     * @return {Number} rotten tomato score
     *
     */
    this.rottenTomatoScore = function(title) {
      var moviesSearch = 'movies.json?q=';
      var searchString = encodeURIComponent(title);

      var defer = $q.defer();
      $http.jsonp(rottenTomatoBaseUrl + moviesSearch + searchString + rottenTomatoApiKey + '&callback=JSON_CALLBACK')
        .success(function(data) {
          var _data = {
            rt_id: data.movies.id,
            rt_ratings: data.movies[0].ratings.critics_score
          };
          defer.resolve(_data);
        })
        .error(function(msg) {
        defer.reject(msg);
      });
      return defer.promise; 
    };

    /**
     * Gets certification rating for movie
     *
     * @param {Number} movie id
     * @return {String} rating i.e. G, PG, PG-13, R, NC-17
     *
     */
    this.certificationRating = function(id) {
      var defer = $q.defer();
      $http.get(baseUrl + 'movie/' + id + '/releases' + apiKey)
        .success(function(data) {
          var _data = {
            id: data.id,
            certification_rating: data.countries[0].certification
          };
          defer.resolve(_data);
        })
        .error(function(msg) {
        defer.reject(msg);
      });
      return defer.promise; 
    };



    /**
     * Gets individual actors roles
     *
     * @param {Number} actor id
     * @return [[]] Array of Arrays
     *
     */
    this.actorRoles = function(id) {
      var defer = $q.defer();
      if(Array.isArray(id)) {
        var promises = [];
        angular.forEach(id, function(actorId) {
          promises.push($http({method: 'GET', url: baseUrl + 'person/' + actorId + '/movie_credits' + apiKey, cache: 'true'}));
        });

        $q.all(promises).then(function(data){
          defer.resolve(data);
        });
      }
      else {
        $http.get(baseUrl + 'person/' + id + "/movie_credits" + apiKey)
          .success(function(data) {
            var _data = {
              roles: function() {
                var _roles = [];
                angular.forEach(data.cast, function(role, index) {
                  if(index <= 2) {
                    var _role = [role.title, role.character];
                    _roles.push(_role);
                  }
                });
                return _roles;
              }()
            };
            defer.resolve(_data.roles);
          })
          .error(function(msg) {
            defer.reject(msg);
          });
      }
      return defer.promise;
    };

    /**
     * Gets info about an individual actor
     *
     * @param {Number} actor id
     * @return {Object}
     *
     */
     this.actorInfo = function(id) {
      var defer = $q.defer();
      $http.get(baseUrl + 'person/' + id + apiKey)
        .success(function(data) {
          data.profile_path = (data.profile_path) ? (imgPath + 'w300' + data.profile_path) : '';
          defer.resolve(data);
        })
        .error(function(msg) {
          defer.reject(msg);
        });
        return defer.promise; 
     };

      


      


    /**
     * Gets Cast info for tv shows
     *
     * @param {Number} id
     * @return {Object}
     *
     */

    // TO-DO: Integrate into already created movie and tv calls,
    //        Make a castDetails function to distinguish between type
    this.tvCastDetails = function(id) {
      // var _type = (type === 'show') ? 'tv' : 'movie';
      var defer = $q.defer();
      $http.get(baseUrl + 'tv/' + id + '/credits' + apiKey)
        .success(function(data) {
          var _data = {
            cast: function() {
              var _cast = [];
              angular.forEach(data.cast, function(actor) {
                var _actor = {
                  id: actor.id,
                  media_type: "actor-personality",
                  poster_path: (actor.profile_path) ? (imgPath + 'w300' + actor.profile_path) : '',
                  card_type: "",
                  name: actor.name,
                  title: "Actor",
                  // metadata: [
                  //   ['Muppets Most Wanted', 'The Great Escapo'],
                  //   ['Thor: The Dark World', 'Loki'],
                  //   ['Exhibition', 'Estate Agent'],
                  //   ['Only Lovers Left Alive', 'Estate Agent']
                  // ]
                };
                _cast.push(_actor);
              });

              return _cast;
            }()
          };
          defer.resolve(_data.cast);
        })
        .error(function(msg) {
          defer.reject(msg);
        });

        return defer.promise;
    };

    


    /**
     * Gets a random carousel from initial data
     *
     */
    this.randomCarousel = function() {
      var defer = $q.defer();
      if(ngtvData) {
        randomCarousel(defer, ngtvData);
      } else {
        this.getCarousels().then(function(data) {
          randomCarousel(defer, data);
        }, function() {
          defer.reject('ERROR');
        });
      }
      return defer.promise; 
    };
    
    /**
     * Gets Details Clips for details modal
     *
     * @description This is random dummy data
     */

    this.getTitleClips = function (type, id) {
      var clipLink;
      if(type === 'show'){
        clipLink = 'tv/'
      } else if (type === 'movie') {
        clipLink = 'movie/'
      }
      var defer = $q.defer();
      $http.get(baseUrl + clipLink + id + '/videos' + apiKey)
        .success(function(data) {
          var _data = {
            id: data.id,
            clips: function() {
              var _clips = [];
              angular.forEach(data.results, function(clip) {
                var clip = {
                  title: clip.name
                };
                _clips.push(clip);
              });
              return _clips;
            }()
          };
          defer.resolve(_data.clips);
      })
      .error(function(msg) {
        defer.reject(msg);
      });
      return defer.promise;      
    };

    /**
     * Gets Similiar Titles for details modal
     *
     * @description This is random dummy data
     */

    var titleType;
    this.getSimilarTitles = function (type, id) {
      var titleLink;
      titleType = type;
      if(type === 'show'){
        titleLink = 'tv/'
      } else if (type === 'movie') {
        titleLink = 'movie/'
      }
      var defer = $q.defer();
      $http.get(baseUrl + titleLink + id + '/similar' + apiKey)
        .success(function(data) {
          var _data = {
            id: data.id,
            titles: function() {
              var _titles = [];
              angular.forEach(data.results, function(title) {
                var _title = {
                  title: title.title,
                  description: title.overview,
                  media_type: titleType,
                  tomato_score: title.vote_average,
                  poster_path: imgPath + 'w500' + title.poster_path,
                  backdrop_path: imgPath + 'w1000' + title.backdrop_path
                };
                if(titleType === 'movie') {
                  _title.title = title.title
                } else {
                  _title.title = title.name
                }
                _titles.push(_title);
              });
              return _titles;
            }()
          };
          defer.resolve(_data.titles);
      })
      .error(function(msg) {
        defer.reject(msg);
      });
      return defer.promise;      
    };

    ////////////////////////
    // Internal Functions //
    ////////////////////////

    function getCarousel(id) {
      var i = 0;
      for(; i < ngtvData.length; i++) {
        if(ngtvData[i].id === parseInt(id)) {
          return ngtvData[i].items;
        }
      }
    }

    function movieDetails(id) {
      var defer = $q.defer();
      $http.get(baseUrl + 'movie/' + id + apiKey)
        .success(function(data) {
          var _data = {
            id: id,
            title: data.title,
            description: data.overview,
            genres: function() {
              var genres = [];
              angular.forEach(data.genres, function(genre) {
                genres.push(genre.name);
              });
              return genres;
            }(),
            media_type: 'movie',
            release_date: data.release_date,
            backdrop_path: imgPath + 'w1000' + data.backdrop_path,
            poster_path: imgPath + 'w1000' + data.poster_path,
            rating: 'TV-MA',
            runtime: data.runtime,
            awards: awards()
          };
          defer.resolve(_data);
      })
      .error(function(msg) {
        defer.reject(msg);
      });
      return defer.promise;
    }



    function showDetails(id) {
      var defer = $q.defer();
      $http.get(baseUrl + 'tv/' + id + apiKey)
        .success(function(data) {
          var _data = {
            id: id,
            title: data.name,
            description: data.overview,
            genres: function() {
              var genres = [];
              angular.forEach(data.genres, function(genre) {
                genres.push(genre.name);
              });
              return genres;
            }(),
            media_type: 'show',
            air_dates: function() {
              var airDate = data.first_air_date.split('-')[0] + '-';
              airDate += data.in_production ? 'Present' : data.last_air_date.split('-')[0];
              return airDate;
            }(),
            number_of_seasons: data.number_of_seasons,
            number_of_episodes: data.number_of_episodes,
            backdrop_path: imgPath + 'w1000' + data.backdrop_path,
            rating: 'TV-MA',
            awards: awards(),
            seasons: function() {
              if(data.seasons && data.seasons[0].season_number === 0) {
                return data.seasons.splice(1, data.seasons.length-1);
              } else {
                return data.seasons;
              }
            }(),
            episodes: true,
            similar_shows: randomBool(),
            clips: randomBool()
          };
          defer.resolve(_data);
      })
      .error(function(msg) {
        defer.reject(msg);
      });
      return defer.promise;      
    }

    /**
     * Gets Details Clips for details modal
     *
     * @description This is random dummy data
     */
    function randomCarousel(defer, data) {
      var _data = data[randomInt(0, data.length-1)].items;
      _data = shuffle(_data);
      defer.resolve(_data);
    }


    //////////////////////
    // Helper Functions //
    //////////////////////

    /**
     * Creates dummy award data
     *
     */
    function awards() {
      var awards = {};
      awards = createAward('emmys', awards);
      awards = createAward('golden_globes', awards);
      if(awards.emmys || awards.golden_globes) {
        awards.nominations = randomInt(5, 100);
      }
      return awards;
    }


    /**
     * Gets data for the details moda
     *
     * @param {String} award name - ex emmys, golden_globes
     * @param {Object} awards object
     * @return {Object}
     */
    function createAward(name, awards) {
      var val = randomBool();
      if(val) {
        awards[name] = randomInt(1, 8);
        return awards;
      } else {
        return awards;
      }
    }


    /**
     * Randomizes an array
     *
     * @param {Array} array to randomize
     * @return {Array}
     */
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }


    /**
     * Creates a random number
     *
     * @param {Number} Min number 
     * @param {Number} Max number
     * @return {Number} Returns a random number between min and max
     */
    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    /**
     * Creates a random boolean
     *
     * @return {Bool} Returns a boolean
     */
    function randomBool() {
      return Math.random() >= 0.5;
    }
  }
]);

})(window.angular);