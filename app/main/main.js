
/* @Todo: Need to make it so folders can
 * have spaces in there name.
 * /



/* THIS FILE NEEDS TO BE CLEANED UP WITH A DYSON */
var debug = requireFromRoot('lib/framework/dtvdebug')('dtv:main');

/** Import Libs **/
var fs = require("fs");
var ejs = require('ejs');
var glob = require('glob');
var jade = require('jade');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var request = require('request');
var protoDir = './prototype';

module.exports = function(app) {
  app.get('/docs', function(req, res) {
    sendFile(res, '/_shared/docs/dist/index.html');
  });

  app.get(/(\/users\/shaneal\/details-modal).+/, function(req, res) {
    sendRouter(req, res, '/users/shaneal/details-modal/');
  });

  app.get(/(\/users\/shaneal\/details-modal-2).+/, function(req, res) {
    sendRouter(req, res, '/users/shaneal/details-modal-2/');
  });

  app.get(/(\/users\/bk\/wave).+/, function(req, res) {
    sendRouter(req, res, '/users/bk/wave/');
  });

  app.get(/(\/users\/shaneal\/wave).+/, function(req, res) {
    sendRouter(req, res, '/users/shaneal/wave/');
  });

  app.get(/(\/users\/shaneal\/ngtv2-desktop).+/, function(req, res) {
    sendRouter(req, res, '/users/shaneal/ngtv2-desktop/');
  });

  app.get(/(\/users\/shaneal\/router-demos\/dynamic-ui-router).+/, function(req, res) {
    sendRouter(req, res, '/users/shaneal/router-demos/dynamic-ui-router/');
  });

  app.get(/(\/wave).+/, function(req, res) {
    sendRouter(req, res, '/wave/');
  });

  app.get('/*', function(req, res, next) {
    if(isNodule(req.url) || req.url === '/favicon.ico') {
      next();
    } else {
      var protoSettings = getPrototype(req.url);
      if(protoSettings) {
        renderPrototype(req, res, protoSettings);
      } else {
        // Setup dtvClientData
        var data = {};
        data.files = walker(protoDir).children;
        data.states = setupStates();
        if(fs.existsSync(protoDir + req.url)) {
          app.set('views', 'app/main');
          app.set('view engine', 'jade');
          res.render('main.jade', {data: data});
        } else {
          send404(res);
        }
      }
    }
  });

  function walker(filename) {
    var _path = filename.replace(protoDir, '');
    var stats = fs.lstatSync(filename),
        info = {
            url: _path + '/',
            stateName: 'home' + _path.split('/').join('.'),
            name: path.basename(filename)
        };

    if(stats.isDirectory()) {
      info.type = "folder";
      var files = fs.readdirSync(filename);

      // Filter out hidden files and folders
      files = files.filter(function(item) {
        return (item.indexOf('.DS_Store') === 0 || item.indexOf('_shared') === 0) ? false : true;
      });

      var subPages = [];
      _.each(files, function(item) {
        if(path.extname(item) === '.jade' || path.extname(item) === '.ejs' || path.extname(item) === '.html') {
          info.type = 'prototype';
          // var file = item.replace('.jade', '').replace('.ejs', '').replace('.html', '');
          var file = item;
          subPages.push({ name: file, url: info.url + file });
        }
      });

      // If project has subpages
      if(subPages.length > 0) { info.subPages = subPages; }

      info.children = files.map(function(child) {
        return walker(filename + '/' + child);
      });
    } else {
      // Assuming it's a file.
      info.url = filename.replace(protoDir, '');
      if(path.extname(filename) === '.gif'  ||
         path.extname(filename) === '.jpg'  ||
         path.extname(filename) === '.jpeg' ||
         path.extname(filename) === '.png' ) {
          info.type = 'image';
      } else if(path.extname(filename) === '.less'  || path.extname(filename) === '.css') {
        info.type = 'css'; 
      } else if(path.extname(filename) === '.jade' || path.extname(filename) === '.ejs') {
        info.type = 'partial';
      } else {
        info.type = "file";
      }
    }
    return info;
  }

  function setupStates() {
    var files = glob.sync(protoDir + '/**');
    files = files.filter(function(file, i) {
      if(file.indexOf('shared') > 0 || i === 0) { return false; }
      return (fs.lstatSync(file).isDirectory());
    });

    var states = {};
    _.each(files, function(file) {
      var _file = file.replace(protoDir + '/', '');
      var stateName = 'home.' + _file.split('/').join('.');
      states[stateName] = {};
      states[stateName].url = file.split('/')[file.split('/').length-1] + '/';
      states[stateName].templateUrl = 'template.html';
    });
    return states;
  }

  function isNodule(url) {
    if(!url) { return false; }
    var nodules = glob.sync(app.nodeRoot + '/app/**/*.js');
    nodules = nodules.filter(function(file, i) {
      if(i === 0) { return false; }
      var stats = fs.lstatSync(file);
      if(stats.isDirectory()) {return false; }
      return (file.indexOf('components') > 0 ||
              file.indexOf('shared') > 0 ||
              file.indexOf('.jade') > 0 ||
              file.indexOf('main.js') > 0) ? false : true;
    });

    var routes = [];
    _.each(nodules, function(nodule) {
      var noduleRoute = require(nodule.replace('.js', ''))(app).route;
      _.each(noduleRoute, function(route) {
        var _url = url.split('?', 1)[0];
        if(_url === route) {
          routes.push(true);
        }
      });
    });
    return (routes.length > 0);
  }

  function getPrototype(url) {
    var data = {};

    if(fs.existsSync(protoDir + url + 'index.jade')) {
      data.templateEngine = 'jade';
      data.file = protoDir + url + 'index.jade';
    }

    if(fs.existsSync(protoDir + url + '.jade')) {
      data.templateEngine = 'jade';
      data.file = protoDir + url + '.jade';
    }

    if(fs.existsSync(protoDir + url + 'index.ejs')) {
      data.templateEngine = 'ejs';
      data.file = protoDir + url + 'index.ejs';
    }

    if(fs.existsSync(protoDir + url + '.ejs')) {
      data.templateEngine = 'ejs';
      data.file = protoDir + url + '.ejs';
    }

    if(fs.existsSync(protoDir + url + 'config.json')) {
      data.config = JSON.parse(fs.readFileSync(protoDir + url + 'config.json'));
    }

    if(!data.config && fs.existsSync((protoDir + path.dirname(url) + '/config.json'))) {
      data.config = JSON.parse(fs.readFileSync(protoDir + path.dirname(url) + '/config.json'));
    }

    return (!_.isEmpty(data)) ? data : null;
  }

  function renderPrototype(req, res, data) {
    if(data && data.file) {
      switch(data.templateEngine) {
        case 'jade':
          var d = (data.config && data.config.data) ? data.config.data : {};
          data.renderedHTML = jade.renderFile(data.file, d);
          break;
        case 'ejs':
          var ejsStr = fs.readFileSync(data.file, 'utf8');
          data.renderedHTML = ejs.render(ejsStr, data.config.data);
          break;
      }

      if(data && data.config) {
        if(data.config.loadBaseTemplate && data.config.header || data.config.footer) {
          var route = 'http://local.directv.com:3000' + '/template';
          var requestOptions = {
            headers: {
              'user-agent': req.headers['user-agent'],
              'cookie' : req.headers.cookie,
              'x-device_device_os': req.headers['x-device_device_os'],
              'x-device_is_wireless_device': req.headers['x-device_is_wireless_device'],
              'x-device_is_tablet': req.headers['x-device_is_tablet'],
              'x-device_resolution_width': req.headers['x-device_resolution_width'],
              'x-device_resolution_height': req.headers['x-device_resolution_height'],
              'referer': req.headers.referer
            },
            url: route,
            method: 'post',
            json: true,
            body: { config:data.config, html: data.renderedHTML }
          };
          request(requestOptions, function (error, response, body) {
            sendHtml(res, body);
          });
        } else {
          sendHtml(res, data.renderedHTML);
        }
      } else {
        sendHtml(res, data.renderedHTML);
      }
    } else {
      checkUrlParents(req, res, req.url);
    }
  }

  function checkUrlParents(req, res, url) {
    var splitPath = url.split(path.sep);
    splitPath.shift();

    var ps;
    _.each(splitPath, function(value, i) {
      var _sp = splitPath;
      _sp.pop();

      var protoSettings = getPrototype('/' + _sp.join(path.sep) + '/');
      if(protoSettings && !protoSettings.file) {
        protoSettings = getPrototype('/' + path.dirname(_sp.join(path.sep)) + '/');
      }

      if(protoSettings) {
        ps = protoSettings
        return false;
      }
    });

    if(ps) {
      renderPrototype(req, res, ps);
    }
  }

  function sendFile(res, file) {
    var options = {
      root: protoDir,
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    res.sendFile(file, options, function (err) {
      if (err) {
        res.status(err.status).end();
      }
      else {
        console.log('Sent:', protoDir + file);
      }
    });
  }

  function sendHtml(res, html) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(html, 'utf8');
    res.end();  
  }

  function send404(res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write("404 Not Found\n", 'utf8');
    res.end();    
  }

  function sendRouter(req, res, url) {
    var data = {};
    data.templateEngine = 'jade';
    data.file = protoDir + url + 'index.jade';
    data.config = {};
    data.config.data = {};

    console.log(' ');
    console.log(' ');
    console.log(req.headers['user-agent'].indexOf('Chrome'));
    console.log(' ');
    console.log(' ');

    // var ua = req.headers['user-agent'];
    // data.config.data.browser = (ua.indexOf('Chrome') !== -1 || ua.indexOf('Firefox') !== -1) ? 'desktop' : 'mobile';
    data.config.data.browser = 'desktop';

    renderPrototype(req, res, data);
  }
};

