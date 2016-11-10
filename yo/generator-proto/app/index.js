'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var yeoman = require('yeoman-generator');

var dtvLog = '\n';
dtvLog += ' _____  _____  _____   ______  _____  _______ __      __' + '\n';
dtvLog += '|  __ \\|_   _||  __ \\ |  ____|/ ____||__   __|\\ \\    / /' + '\n';
dtvLog += '| |  | | | |  | |__) || |__  | |        | |    \\ \\  / /' + '\n';
dtvLog += '| |  | | | |  |  _  / |  __| | |        | |     \\ \\/ /' + '\n';
dtvLog += '| |__| |_| |_ | | \\ \\ | |____| |____    | |      \\  /' + '\n';
dtvLog += '|_____/|_____||_|  \\_\\|______|\\_____|   |_|       \\/' + '\n';
dtvLog += '\n\n';

var ProtoGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.protoDirs = function () {
      var paths = glob.sync('./prototype/**');
      var dirs = [];

      //push project directories to dirs
      _.each(paths, function(_path) {
        if(fs.lstatSync(_path).isDirectory() &&
           _path.indexOf('assets') < 0 &&
           _path.indexOf('_shared') < 0 && 
           _path !== './prototype') {

          var subFiles = glob.sync(_path + '/*');
          var addPath = true;

          //loop through all the files
          _.each(subFiles, function(subFile) {
            var basename = path.basename(subFile);
            var ext = path.extname(basename);

            if(ext === '.jade' || ext === '.ejs') {
              addPath = false;
              return addPath;
            }
          });

          if(addPath) {
            var p = _path.replace('./', '');
            dirs.push(p);
          }
        }
      });

      if(dirs.length === 0) {
        if(fs.existsSync('./prototype')) {
          dirs.unshift('prototype');
          console.log(chalk.white(dtvLog));
          return dirs;
        } else {
          throw chalk.red('DOODE - You can only run yeoman from the root folder!!!\n');
        }
      } else {
        dirs.unshift('prototype');
        console.log(chalk.white(dtvLog));
        return dirs;
      }
    };
  },

  promptUser: function() {
    var done = this.async();
    var prompts = [
      {
        name: 'appName',
        type: 'input',
        message: 'What\'s your project name?'
      },
      {
        name: 'cwd',
        type: 'list',
        choices: this.protoDirs(),
        message: 'Select your cwd:'
      },
      {
          when: function(response) {
            console.log('[?] Create a new directory inside ' + chalk.cyan(response.cwd) + ' ?');
            return true;
          },
          name: 'createNewDir',
          type: 'input',
          message: '(Y/n)'
      }, {
          when: function (response) {
            if(response.createNewDir === 'y' || response.createNewDir === 'Y') {
              return true;
            } else {
              return false;
            }
          },
          name: 'dirName',
          type: 'input',
          message: 'New folder name:'
      },
      // {
      //   name: 'theme',
      //   type: 'list',
      //   choices: ['light', 'dark'],
      //   message: 'Select a theme to include:'
      // },
      {
        name: 'includeHeader',
        type: 'confirm',
        message: 'Include DirecTV header? '
      }, 
      // {
      //     when: function(response) {
      //       return response.includeHeader;
      //     },
      //     name: 'navSection',
      //     type: 'list',
      //     choices: ['Entertainment', 'Marketing'],
      //     message: 'Select a header section:'
      // },
      {
        name: 'includeFooter',
        type: 'confirm',
        message: 'Include DirecTV footer? '
      },
      {
        name: 'tempEngine',
        type: 'list',
        choices: ['Jade', 'ejs'],
        message: 'Which templating language would you like to use?'
      }
    ];

    this.prompt(prompts, function(props) {
      this.appName = props.appName;
      this.createNewDir = props.createNewDir;
      this.cwd = props.cwd;
      this.dirName = props.dirName;
      this.includeFooter = props.includeFooter;
      this.includeHeader = props.includeHeader;
      this.navSection = 'Entertainment';
      this.tempEngine = props.tempEngine;
      this.theme = props.theme;

      var appNameSlug = this.appName;
      appNameSlug = appNameSlug.toLowerCase();
      appNameSlug = appNameSlug.replace(new RegExp(' ', 'g'), '-');

      var _path = this.cwd + '/';

      if(this.createNewDir === 'y' || this.createNewDir === 'Y') {
        var dirnameSlug = this.dirName.toLowerCase();
        dirnameSlug = dirnameSlug.replace(new RegExp(' ', 'g'), '-');
        _path += dirnameSlug + '/' + appNameSlug;
      } else {
        _path += appNameSlug;
      }

      _path = _path.replace('prototype', '');

      var config = {};
      config.slug = this.appName.toLowerCase().replace(/ /g, '-');
      config.theme = this.theme || 'dark';
      config.header = this.includeHeader;
      config.footer = this.includeFooter;
      config.navSection = 'entertainment';
      config.loadBaseTemplate = (this.includeHeader || this.includeFooter) ? true : false;
            
      config.headStyles = {};
      config.headStyles.prepend = [];
      config.headStyles.append = [];

      config.bottomScripts = {};
      config.bottomScripts.prepend = [];
      config.bottomScripts.append = [];

      config.data = {};

      if(this.navSection === 'Marketing') {
        config.navSection = 'marketing';
      }

      _path = './prototype' + _path;

      var _sharedInitPath = '@import "';
      _sharedInitPath += path.relative(_path.replace('./', '') + '/assets/css/styles.less', ('prototype/_shared/app/css/init-' + this.theme + '.less'));
      _sharedInitPath += '";';

      _sharedInitPath = _sharedInitPath.replace('../', '');

      console.log(_sharedInitPath);
      console.log(_path.replace('./', '') + '/assets/css/styles.less');
      console.log('prototype/_shared/app/css/init-' + this.theme + '.less');

      this.mkdir(_path);
      this.mkdir(_path + '/assets/css');
      this.mkdir(_path + '/assets/img');
      this.mkdir(_path + '/assets/js');
      this.write(_path + '/config.json', JSON.stringify(config, null, 2));
      this.write(_path + '/assets/css/styles.less', _sharedInitPath);
      this.copy('common/assets/js/_scripts.js', _path + '/assets/js/scripts.js');

      if(this.tempEngine === 'ejs') {
        this.copy('ejs/_index.ejs', _path + '/index.ejs');
      } else {
        this.copy('jade/_index.jade', _path + '/index.jade');
      }

      var open = require('open');
      setTimeout(function(){
        open('http://local.directv.com:3000/' + _path.replace('./prototype/', '').replace('prototype', ''));
      }, 5000);

      done();
    }.bind(this));
  }
});
 
module.exports = ProtoGenerator;