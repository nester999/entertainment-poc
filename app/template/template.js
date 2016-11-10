var debug = requireFromRoot('lib/framework/dtvdebug')('dtv:template');
var _ = require('lodash');

// see lib/framework/controller.js - defaultConfig for component-level properties/functions and how to use them
module.exports = function(app) {
  return {
    route: ['/template'],
    routeVerb: 'post',

    preProcessor: function(req, res) {
      debug('preProcessor!!!!');
    },

    postProcessor: function(req, res) {
      var renderData = req.body;
      renderData.appendHeadScripts = '';
      renderData.prependHeadScripts = '';
      renderData.appendHeadStyles = '';
      renderData.prependHeadStyles = '';
      renderData.appendBottomScripts = '';
      renderData.prependBottomScripts = '';

      res.locals.config.default_nav = (renderData.config.dtvNav === 'entertainment') ? 'ep' : '';
      res.locals.config.theme = renderData.config.theme;
      renderData.windowTitle = renderData.config.title;

      if(renderData.config.headScripts) {
        if(renderData.config.headScripts.append) {
          _.each(renderData.config.headScripts.append, function(script) {
            renderData.appendHeadScripts += '<script src="' + script + '"></script>';
          });
        }

        if(renderData.config.headScripts.prepend) {
          _.each(renderData.config.headScripts.prepend, function(script) {
            renderData.prependHeadScripts += '<script src="' + script + '"></script>';
          });
        }
      }

      if(renderData.config.headStyles) {
        if(renderData.config.headStyles.append) {
          _.each(renderData.config.headStyles.append, function(stylesheet) {
            renderData.appendHeadStyles += '<link rel="stylesheet" href="' + stylesheet + '">';
          });
        }

        if(renderData.config.headStyles.prepend) {
          _.each(renderData.config.headStyles.prepend, function(stylesheet) {
            renderData.prependHeadStyles += '<link rel="stylesheet" href="' + stylesheet + '">';
          });
        }
      }

      if(renderData.config.bottomScripts) {
        if(renderData.config.bottomScripts.append) {
          _.each(renderData.config.bottomScripts.append, function(script) {
            renderData.appendBottomScripts += '<script src="' + script + '"></script>';
          });
        }

        if(renderData.config.bottomScripts.prepend) {
          _.each(renderData.config.bottomScripts.prepend, function(script) {
            renderData.prependBottomScripts += '<script src="' + script + '"></script>';
          });
        }        
      }

      // Override debug stuff
      renderData.style = '<style>#DBUG { display: none; }</style>';
      res.yukon.renderData = renderData;
    }
  };
};