var fs = require('fs');
var qs = require('querystring');
var apiKey = "ecda3228e70942921f2177da1ff9ba5d";
var mdb = require('moviedb')(apiKey);
var _ = require('lodash');

var fileNames = ['continue-watching', 'watchlist', 'based-on-what-watch', 'oscar-nominees', 'movies', 'shows', 'following', 'just-added', 'live-streaming', 'binge-worth-series'];
var omdbData = JSON.parse(fs.readFileSync('omdb-data-full.json', 'utf-8'));
var movies = [];
var shows = [];
var data = [];
var lengths = [];

var sleep = require('sleep');


for(var i = 0; i < omdbData.length; i++) {

  console.log(omdbData[i].card_type);

  if(omdbData[i].card_type === 'tv') {
    shows.push(omdbData[i]);
  } else {
    console.log('---------------');
    movies.push(omdbData[i]);
  }
}


// sleep.sleep(5);

var data = [];

for(var i = 0; i < fileNames.length; i++) {
  var d = JSON.parse(fs.readFileSync(fileNames[i] + '.json', 'utf-8'));
  lengths.push(d.length);
  data.push(d);
}

for(var i = 0; i < data.length; i++) {
  var l = 20 - data[i].length;
  if(l !== 0) {
    if(fileNames[i] === 'movies') {
      data[i] = addShit(movies, data[i], l);
      // console.log(data[i]);
    } else if(fileNames[i] === 'shows') {
      data[i] = addShit(shows, data[i], l);
    } else {
      data[i] = addShit(omdbData, data[i], l);
    }
  }
}

var names = ['Continue Watching', 'Watchlist', 'Based on What You Watch', '2015 Oscar Nominees', 'Movies', 'Shows', 'Following', 'Just Added', 'Live Streaming', 'Binge-Worthy Series'];
var nData = [];
var u = 100;
for(var i = 0; i < data.length; i++) {
  var obj = {};
  obj.id = u;
  obj.name = names[i];
  u++;
  obj.items = data[i];
  nData.push(obj);
}


fs.writeFile('data.json', JSON.stringify(nData, null, 2), function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('JSON saved to data.json');
  }
});



function addShit(data, a, l) {
  var _array = a;
  for(var j = 0; j < l; j++) {
    _array.push(data[getRandomInt(0, data.length-1)]);
  }
  return _array;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
