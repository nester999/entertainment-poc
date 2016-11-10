var debug = requireFromRoot('lib/framework/dtvdebug')('dtv:initialState');

// see lib/framework/controller.js - defaultConfig for component-level properties/functions and how to use them
module.exports = function(app) {
  return {
    route: ['/json/browse'],
    // useStub: true,

    postProcessor: function(req, res) {
      debug('postProcessor!!!');

      res.yukon.renderData = {people: true};
    }
  };
};