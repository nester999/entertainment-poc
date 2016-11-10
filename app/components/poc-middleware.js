var lessMiddleware = require('less-middleware');
var express = require('express');

module.exports = function() {
  return {
    top: lessMiddleware(process.cwd() + '/prototype', { debug: true}),
    static: express.static(process.cwd() + '/prototype')
  };
};