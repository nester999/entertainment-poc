
module.exports = function(grunt) {

  grunt.initConfig({
  });

	grunt.loadTasks('lib/grunt');
  require('./lib/grunt/gruntfile.js')(grunt);
};