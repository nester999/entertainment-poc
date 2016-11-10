// This app creates the base for all the other files

var fs = require('fs');
var qs = require('querystring');
var apiKey = "ecda3228e70942921f2177da1ff9ba5d";
var mdb = require('moviedb')(apiKey);

// CONTINUE WATCHING
var cw = [
  {id: 177572, type: 'movie'}, //Big Hero 6
  {id: 1426, type: 'tv'}, //Luther
  {id: 2947, type: 'tv'} //Veep
];

// WATCHLIST
var w = [
  {id: 1407, type: 'tv'}, //homeland
  {id: 72784, type: 'movie'}, //The Loft
  {id: 39754, type: 'tv'}, //BETWEEN TWO FERNS
  {id: 56296, type: 'tv'}, //Orphan Black
];

// BASED ON WHAT YOU WATCH
var bw = [
  {id: 118340, type: 'movie'},
  {id: 46648, type: 'tv'},
  {id: 252838, type: 'movie'},
  {id: 116149, type: 'movie'}
];

// 2015 Oscar Nominees
var on = [
  {id: 84365,  type:'movie'}, // Whiplash
  {id: 194662, type:'movie'}, // Birdman
  {id: 266856, type:'movie'}, // Theory of everything
  {id: 190859, type:'movie'}, // American Sniper
  {id: 205596, type:'movie'}, // The Imitation Game
  {id: 247434, type:'movie'}, // Selma
  {id: 120467, type:'movie'}, // Grand Budapest Hotel
  {id: 85350,  type:'movie'}, // Boyhood
  {id: 87492,  type:'movie'}, // Foxcatcher
  {id: 87492,  type:'movie'}, //Inherent Vice
  {id: 102651, type:'movie'}, //Maleficent
  {id: 245700, type:'movie'}, //Mr. Turner
  {id: 227306, type:'movie'}, //Unbroken
  {id: 209274, type:'movie'}, //Ida
  {id: 170687, type:'movie'}, //Boxtrolls
  {id: 110416, type:'movie'}, //Song of the Sea
  {id: 149871, type:'movie'}, //Tale of the Princess Kaguya
  {id: 82702,  type:'movie'}, //How to Train Your Dragon 2
  {id: 228970, type:'movie'}, //Wild
  {id: 118340, type:'movie'}, //Guardians of the Galaxy 2
  {id: 157336, type:'movie'}, //interstellar
];

// Movies
var m = [
  {id: 228165, type: 'movie'},
  {id: 264660, type: 'movie'},
  {id: 181283, type: 'movie'},
  {id: 157336, type: 'movie'}
];

// Shows
var s = [
  {id: 1396, type: 'tv'},
  {id: 61406, type: 'tv'},
  {id: 1425, type: 'tv'},
  {id: 2316, type: 'tv'}
];

// Following
var f = [
  {id: 102899, type: 'movie'},
  {id: 273895, type: 'movie'},
  {id: 4385, type: 'tv'}
];

// Just Added
var ja = [
  {id: 210860, type: 'movie'},
  {id: 42282, type: 'tv'},
  {id: 205596, type: 'movie'},
  {id: 1593, type: 'movie'}
];

// Live TV Streaming
var ltv = [
  {id: 33922, type: 'tv'},
  {id: 60705, type: 'tv'},
  {id: 13342, type: 'movie'},
  {id: 284293, type: 'movie'}
];

// BINGE WORTH SERIES
var bws = [
  {id: 1399, type: 'tv'},
  {id: 37680, type: 'tv'},
  {id: 1438, type: 'tv'},
  {id: 688, type: 'tv'}
];

var omdbData = JSON.parse(fs.readFileSync('omdb-data.json', 'utf-8'));

// WEB SERIES & CLIPS

// MUSIC
//blake shelton
//when i was your man
// uptown funk
//blank space

var data = [];
var array = [cw, w, bw, on, m, s, f, ja, ltv, bws, omdbData];
var j = 10;
var fileName = ['continue-watching', 'watchlist', 'based-on-what-watch', 'oscar-nominees', 'movies', 'shows', 'following', 'just-added', 'live-streaming', 'binge-worth-series', 'omdb-data-full'];

function info(i) {
  var api = (array[j][i] && array[j][i].type === 'movie') ? 'movieInfo' : 'tvInfo';
  console.log(array[j][i]);
  mdb[api]({id:array[j][i].id}, function(err, res) {
    var d = {};
    if(res) {
      d.id = res.id;
      d.poster_path = 'https://image.tmdb.org/t/p/w500' + res.poster_path;
      d.backdrop_path = 'https://image.tmdb.org/t/p/w500' + res.backdrop_path;
      d.vote_average = res.vote_average;

      if(api === 'movieInfo') {
        d.card_type = 'movie';
        d.heading_title = res.original_title;
        d.details_title = res.original_title;
        d.overview = res.overview;
        d.card_type = 'movie';
      } else {
        d.heading_title = res.original_name;
        d.details_title = res.original_name;
        d.number_of_episodes = res.number_of_episodes;
        d.number_of_seasons = res.number_of_seasons;
        d.caption = res.number_of_seasons + ' Seasons, ' + res.number_of_episodes + ' Episodes';
        d.card_type = 'tv';
      }
      data.push(d);
    }

    if(i+1 < array[j].length) {
      info(i+1);
    } else {
      fs.writeFile(fileName[j] + '.json', JSON.stringify(data, null, 2), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('JSON saved to ' + fileName[j] + '.json');
        }
      });
    }
  });
}

// console.log(array[j][0].id);

info(0);

// var a = 'http://image.tmdb.org/t/p/w1280/'
// mdb.movieImages({id:continueWatching[0]}, function(err, res) {
//   console.log(res);
// });

