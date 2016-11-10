// TODO: grab minified versions in build mode
var helpers = require(process.cwd() + '/lib/grunt/helpers');

var GENERATED_PATH = 'www/_generated/assets';
var ASSETS_PATH = 'www/assets';
var BUNDLES = [

];

var generators = {
  selfcare: helpers.getLess('/css/global/', 'selfcare', GENERATED_PATH, ASSETS_PATH),
  myprofile: helpers.getLess('/css/selfcare/myprofile/', 'myprofile', GENERATED_PATH, ASSETS_PATH),
  myequipment: helpers.getLess('/css/selfcare/myequipment/','myequipment', GENERATED_PATH, ASSETS_PATH),
  myprogramming: helpers.getLess('/css/selfcare/myprogramming/','myprogramming', GENERATED_PATH, ASSETS_PATH)
};


BUNDLES.forEach(function(bundle) {
  module.exports[bundle] = {
    src: [ bundle ].map(generators[bundle]('src')),
    dest: generators[bundle]('dest')()
  };
});

