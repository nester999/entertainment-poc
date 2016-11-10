

/*
*
*
TO-DO: this is temporary. Once we merge 1.5 here we can just use one in 1.5 dtvModule.
*
*
*/


(function() {
  'use strict';

  var DEVICE_TYPES = ['Phone', 'Tablet', 'Laptop', 'Desktop'];
  var TABLET_MIN_WIDTH = 400;
  var DESKTOP_BREAKPOINT = 1440;
  var BREAKPOINT_SM = 0;
  var BREAKPOINT_MD = 490;
  var BREAKPOINT_LG = 960;
  var BREAKPOINT_XL = 1440;

  /**
   * Environment service singleton
   *
   * @param {Window} window the window object
   */
  function EnvironmentService($window) {
    var _this = this;
    var _deviceType;
    var jqWindow = $($window);

    /**
     * Feature detect the current environment supporting touch events
     *
     * @return {Bool}
     */
    this.hasTouch = function() {
      return window.Modernizr && window.Modernizr.touch;
    };

    /**
     * Feature detect the current environment supporting pointer events
     *
     * @return {Bool}
     */
    this.hasPointer = function() {
      return window.Modernizr && window.Modernizr.testProp('pointerEvents');
    };

    /**
     * Boolean states for potential this.getDeviceType() results
     *
     * @return {String} [mobile, tablet, laptop, desktop]
     */
    this.setDeviceType = function(sDeviceType) {
      _deviceType = sDeviceType; // cached variable

      $('html').addClass('is-'+sDeviceType);
      DEVICE_TYPES.forEach(setTypeState);
      _this.device = sDeviceType;
      
      // TO-DO: HACK
      var queries = {};
      if(document.location.search){
        $.each(document.location.search.substr(1).split('&'), function(c,q){
          var i = q.split('=');
          queries[i[0].toString()] = i[1].toString();
        });  
      }else{
        if ($('html').hasClass('touch')) {
          queries['platform'] = 'mobile';
        } else {
          queries['platform'] = 'desktop';
        }
      }
      // _this.deviceType = sDeviceType == 'phone' || sDeviceType == 'tablet' ? 'mobile' : 'desktop';
      _this.platform = queries.platform;

      

      return sDeviceType;
    };


    this.sniffAndroid = function() {
      var sDeviceType = _this.device;
      if (sDeviceType === "phone" || sDeviceType === "tablet") {
        var nua = navigator.userAgent;
        var isAndroid = ((nua.indexOf('Mozilla') > -1 && nua.indexOf('Android') > -1 && nua.indexOf('AppleWebKit') > -1));
        var isAndroidBrowser = (isAndroid && (nua.indexOf('Chrome') === -1));
        if (isAndroid){
          _this.isAndroid = true;
          $('html').addClass('android');
        } else {
          _this.isAndroid = false;          
        }
        if (isAndroidBrowser) {
          _this.isAndroidBrowser = true;
          $('html').addClass('is-android-browser');
        } else {
          _this.isAndroidBrowser = false;          
        }
      } else {
        _this.isAndroid = false;          
        _this.isAndroidBrowser = false;          
      }
    };

    this.iOSversion = function() {
      if (/iP(hone|od|ad)/.test(navigator.platform)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
      }
    };

    this.sniffBrowser = function(){
      _this.browser = "";
      var nua = navigator.userAgent;
      if (nua.indexOf("MSIE") !== -1 || nua.indexOf("Trident") !== -1 || nua.indexOf("Edge") !== -1) {
        _this.browser = "ie";
      }
      else if (nua.indexOf("Chrome") !== -1) {
        _this.browser = "chrome";
      }
      else if (nua.indexOf("Firefox") !== -1) {
        _this.browser = "firefox";
      }
      else if (nua.indexOf("Safari") !== -1 && nua.indexOf("Chrome") === -1) {
        _this.browser = "safari";
      }
      else if (nua.indexOf("Opera") !== -1) {
        _this.browser = "opera";
      }
      $('html').addClass(_this.browser);
    };

    this.sniffOS = function(){
      if (_this.isComputer){
        var platform = navigator.platform;
        _this.isMac = platform.toUpperCase().indexOf('MAC')>=0;
        _this.isWin = platform.toUpperCase().indexOf('WIN')>=0;
        _this.isUnix = platform.toUpperCase().indexOf('UNIX')>=0;
        if (_this.isMac) $('html').addClass('mac');
        if (_this.isWin) $('html').addClass('windows');
        if (_this.isUnix) $('html').addClass('unix');      
      }
    };

    /**
     * Feature detect the current environment supporting pointer events
     *
     * @return {String} [mobile, tablet, laptop, desktop]
     */
    this.getDeviceType = function(){
      if (_deviceType) return _deviceType;

      var innerWidth = window.innerWidth;
      var innerHeight = window.innerHeight;
      var minWidth;

      // fork off `mobile` device hooks. Currently based on a combination
      // of screen size and the existence of touch or pointer events
      // remove this.hasPointer() for now since desktop browser has pointer-events and return tablet for desktop/laptop 
      if ($('html').hasClass('is-device')){
        minWidth = innerWidth < innerHeight ? innerWidth : innerHeight;
        if ($('html').hasClass('is-phone')) {
          return this.setDeviceType('phone');
        } else{
          return this.setDeviceType('tablet');
        }
      } else {      
        if (innerWidth < DESKTOP_BREAKPOINT) {
          return this.setDeviceType('laptop');
        } else {
          return this.setDeviceType('desktop');
        }
      }
    };

    function setTypeState(type) {
      _this['is' + type] = (_this.getDeviceType() === type.toLowerCase());
      if (_this.getDeviceType() === "phone" || _this.getDeviceType() === "tablet"){
        _this.isDevice = true;
        _this.isComputer = false;
      } else {
        _this.isDevice = false;
        _this.isComputer = true;
      }
    }

    
    this.getOrientation = function() {
      var innerWidth = window.innerWidth;
      var innerHeight = window.innerHeight;
      if (innerWidth > innerHeight) {
        _this.orientation = 'landscape';
        _this.isPortrait = false;
        _this.isLandscape = true;      
      } else {
        _this.orientation = 'portrait';
        _this.isPortrait = true;
        _this.isLandscape = false;      
      }
      $('html').removeClass('landscape portrait').addClass(_this.orientation);
    };
    
    this.getBreakPoint = function() {
      var innerWidth = window.innerWidth;
      if (innerWidth > BREAKPOINT_XL) {
        _this.breakPoint = 4;
      } else if (innerWidth > BREAKPOINT_LG) {
        _this.breakPoint = 3;
      } else if (innerWidth > BREAKPOINT_MD) {
        _this.breakPoint = 2;
      } else if (innerWidth > BREAKPOINT_SM) {
        _this.breakPoint = 1;
      } else {
        _this.breakPoint = 0;
      }
    };

    /**
     * Boolean properties for potential this.getDeviceType() results
     *
     * isPhone
     * isTablet
     * isLaptop
     * isDesktop
     */
    this.getDeviceType();
    DEVICE_TYPES.forEach(setTypeState);
    this.sniffAndroid();
    this.sniffOS();
    this.sniffBrowser();
    this.getOrientation();
    this.getBreakPoint();
  }

  if (angular){
    var dtvModule = angular.module('dtvModule',[]);
    dtvModule.service('$env', ['$window', EnvironmentService]);
  }
  window.$env = new EnvironmentService(window);

}());