// var Client = require('node-rest-client').Client;
// var client = new Client();

var fs = require('fs');
var qs = require('querystring');
var apiKey = "ecda3228e70942921f2177da1ff9ba5d";
var mdb = require('moviedb')(apiKey);


var continueWatching = [
  177572, //'Big Hero 6'
  5653, //'Luther'
  289556, //Veep
];

var oscarNominees = [
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

var watchlist = [
  {id: 1407, type: 'tv'}, //homeland
  {id: 72784, type: 'movie'}, //The Loft
  {id: 39754, type: 'tv'}, //BETWEEN TWO FERNS
  {id: 56296, type: 'tv'}, //Orphan Black
  {id: 76341, type: 'movie'}, //Mad Max: Fury Road
  {id: 254470, type: 'movie'}, //Pitch Perfect 2
  {id: 99861, type: 'movie'}, //Avengers: Age of Ultron
  {id: 264660, type: 'movie'}, //Ex Machina
  {id: 158852, type: 'movie'}, //Tomorrowland
  {id: 1399, type: 'tv'}, //Game of thrones
  {id: 1412, type: 'tv'}, //The Flash
  {id: 1104, type: 'tv'}, //Mad Men
  {id: 297761, type: 'movie'}, //Suicide Squad
  {id: 135397, type: 'movie'}, //Jurassic World
  {id: 61889, type: 'tv'}, //Daredevil
  {id: 198184, type: 'movie'}, //Chappie
  {id: 227719, type: 'movie'}, //Project Almanac
  {id: 168259, type: 'movie'}, //Furious Seven
  {id: 209112, type: 'movie'}, //Batman v Superman: Dawn of Justice
  {id: 271110, type: 'movie'} //Captain America: Civil War
];

var movies = [
  228165, //spongebobmovie
  264660, //exmachina
  181283, //child 44
  157336, //interstellar

];

//Continue Watching
console.log(oscarNominees.length);
console.log('--------------');

mdb.miscPopularMovies({page:1}, function(err, res) {
  console.log(res);
}); 