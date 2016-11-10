// var fs = require('fs');
var qs = require('querystring');
var apiKey = "ecda3228e70942921f2177da1ff9ba5d";
var mdb = require('moviedb')(apiKey);
var _ = require('lodash');
var fs = require('fs');
var request = require('request');


var JSONData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
var data = [];

var d = [];

var download = function(uri, filename, callback){

  request.head(uri, function(err, res, body) {

    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    if(res.headers['content-type'] === 'image/jpeg') {
      var r = request(uri).pipe(fs.createWriteStream(filename));
      r.on('close', callback);
    } else {
      callback();
    }
  });
};



for(var i = 0; i < JSONData.length; i++) {
  walk(JSONData[i]);

  if(i === JSONData.length-1) {
    // console.log('hello', d);
    hello(0);
  }
}

function hello(i) {
  console.log(i, d.length);
  if(d[i]) {
    // console.log('https://image.tmdb.org/t/p/w600' + d[i], 'images/posters' + d[i]);
    download('https://image.tmdb.org/t/p/w600' + d[i], 'images/yo' + d[i], function() {
      if(i+1 < d.length) {
        hello(i+1);
      }
    });
  } else {
    if(i+1 < d.length) {
      hello(i+1);
    }
  }
}

// fs.writeFile('data.json', JSON.stringify(nData, null, 2), function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('JSON saved to data.json');
//   }
// });




function walk(obj) {
  function _walk(obj) {
    for(var k in obj) {
      if(typeof obj[k] === 'object' && obj[k] !== null) {
        // if(obj[k].url === ) {
          d.push(obj[k].poster_path);
          // return;
        // }
        _walk(obj[k]);
      }
    }
    if(obj[k] && obj[k].length > 0) { return; }
  }
  _walk(obj);
}

console.log('---');