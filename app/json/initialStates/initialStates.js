var debug = requireFromRoot('lib/framework/dtvdebug')('dtv:initialState');

// see lib/framework/controller.js - defaultConfig for component-level properties/functions and how to use them
module.exports = function(app) {
  return {
    route: ['/json/initial-states'],

    postProcessor: function(req, res) {
      debug('postProcessor!!!');

      var ua = req.headers['user-agent'];
      var isMobile = (/mobile/i.test(ua)) ? true : false;

      var data = [
        {
          stateName: 'home',
          urlPrefix: '/',
          views: {
            'dtv-header': {
              templateUrl: 'assets/components/nav/nav.html'
            },
            'dtv-tup': {
              controller: 'BrowseCtrl',
              templateUrl: 'assets/components/browse/browse.web.html'
            }
          },
          type: 'ui-router',
          dependencies: [
            'assets/components/browse/browse.service.js',
            'assets/components/browse/browse.controller.js',
            'assets/css/browse.web.css'
          ]
        },
        {
          stateName: 'movies',
          urlPrefix: '/movies',
          type: 'lazyload',
          dependencies: [
            'assets/components/browse/browse.module.js',
            'assets/css/modal.css'
          ]
        }
      ];

      if(false) {
        var home = data[0];
        home.views['dtv-tup'].templateUrl = 'assets/components/browse/browse.mobile.html';
        home.dependencies[2] = 'assets/css/browse.mobile.css';
      }

      res.yukon.renderData = data;
    }
  };
};