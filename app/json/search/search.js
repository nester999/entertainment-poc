var debug = requireFromRoot('lib/framework/dtvdebug')('dtv:initialState');

// see lib/framework/controller.js - defaultConfig for component-level properties/functions and how to use them
module.exports = function(app) {
  return {
    route: ['/json/search'],
    apiCalls: [{
      path: '/program/search'}
    ],
    
    preProcessor: function(req, res) {
      this.apiCalls[0].params = req.query;
    },

    postProcessor: function(req, res) {
      res.yukon.renderData = res.yukon.data1;
    }
  };
};