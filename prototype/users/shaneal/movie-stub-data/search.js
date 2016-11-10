var fs = require('fs');
var qs = require('querystring');
var apiKey = "ecda3228e70942921f2177da1ff9ba5d";
var mdb = require('moviedb')(apiKey);

var data = [];
var fileName = 'omdb-data.json';

// function searchMovies(i) {
//   console.log(i);
//   mdb.miscPopularMovies({page:i}, function(err, res) {
//     if(res) {
//       res.results.forEach(function(item) {
//         var d = {};
//         d.id = item.id;
//         d.media_type = 'movie';
//         data.push(d);
//       });

//       if(i+1 < 5) {
//         searchMovies(i+1);
//       } else {
//         searchTv(1);
//       }
//     }
//   });
// }

// function searchTv(i) {
//   console.log(i);
//   mdb.miscPopularTvs({page:i}, function(err, res) {
//     if(res) {
//       res.results.forEach(function(item) {
//         var d = {};
//         d.id = item.id;
//         d.media_type = 'tv';
//         data.push(d);
//       });
//     }

//     if(i+1 < 4) {
//       searchTv(i+1);
//     } else {
//       shuffle(data);
//       fs.writeFile(fileName, JSON.stringify(data, null, 2), function(err) {
//         if(err) {
//           console.log(err);
//         } else {
//           console.log("JSON saved to " + fileName);
//         }
//       });
//     }
//   });
// }

// function shuffle(array) {
//   var currentIndex = array.length, temporaryValue, randomIndex ;
//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }
//   return array;
// }

// searchMovies(1);

mdb.searchMulti({query:'The Theory of Everything'}, function(err, res) {
  console.log(res);





});



// var j = [];

// function season(w) {

//   mdb.tvSeasonInfo({id:1420, season_number: w}, function(err, res) {
//     var d = [];

//     for(var i = 0; i < res.episodes.length; i++) {
//       var obj = {};
//       obj.episode_number = i+1;
//       obj.name = res.episodes[i].name;
//       obj.description = res.episodes[i].overview;
//       obj.duration = 42;
//       d.push(obj);
//     }

//     j.push(d);

//     if(w === 4) {
//       console.log(JSON.stringify(j, null, 2));
//     } else {
//       season(w+1);
//     }
//   });

// }

// season(1);

