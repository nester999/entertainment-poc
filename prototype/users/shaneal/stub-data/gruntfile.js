var lwip = require('lwip');
var sizeOf = require('image-size');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  grunt.registerTask('default', function(){

    var a = {};
    a.movies = [];

    grunt.file.recurse('tv', function (abspath, rootdir, subdir, filename) {
      var obj = {
        "title": "",
        "src": "",
        "episodeDetails": "",
        "id": 0,
        "programType" : "tv"
      };

      // if(filename !== '.DS_Store') {
      //   obj.src = filename;
      //   obj.id = getRandomInt(500, 2000);
      //   a.movies.push(obj);
      // }
    });
  });

  grunt.registerTask('default2', function(){
    var data = grunt.file.readJSON('data.json');
    var movies = data.movies;
    var shows = data.shows;

    for(var i = 0; i < movies.length; i++) {
      movies[i].tmb = movies[i].src;
      movies[i].artworkSrc = "";
    }

    for(var j = 0; j < shows.length; j++) {
      shows[j].tmbSrc = 'tmb-' + shows[j].src;
      shows[j].artworkSrc = "";
    }

    // grunt.file.write('data.json', JSON.stringify(data, null, 2));
    console.log(JSON.stringify(data, null, 2));
  });

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  require('load-grunt-tasks')(grunt);
};