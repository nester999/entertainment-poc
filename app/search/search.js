var debug = requireFromRoot('lib/framework/dtvdebug')('dtv:programsearch');
var sanitizer = require('sanitizer');

// see lib/framework/controller.js - defaultConfig for component-level properties/functions and how to use them
module.exports = function(app) {
  return {
    // Program Search (all parameters are optional except must have keyword or maincategory)
    // ?keyword={search term}&maincategory={Movies}
    // &resultsetstart={0-N}&resultsetend={0-N} // infinite scroll, also starting browse amount
    // &orderby={[blank]=A-Z, ReleaseDate:DESCENDING, StarRating:DESCENDING} // sort
    // &islinear={bool}&isnonlinear={bool}&isstreaming={bool} //isLinear+isNonLinear = On TV, isstreaming = Online
    // &deliveryjointype={true} // always set to true
    // &ppv={bool}&myshows={bool} // ppv=false = Hide PPV, myshows=true = My Channels
    // &subcategory={Animation,Drama,etc}&ratings={G.PG,etc}&starrating={1-5}&format={HD,SD,etc}
    // &istheatricalmovie={bool}&releasedatefrom={YYYYMMDD000000}&releasedateto={YYYYMMDD000000} // isTheatricalMovie=true == Coming Soon, last 60 days = New Release
    route: ['json/search'],
    apiCalls: [{
      path: '/program/search',
    }],
    
    preProcessor: function(req, res) {
      debug('preProcessor!!!!');


      console.log(req.query.keyword);

      //US3497-Default- alpha sorting-Programmer Pages changes
      // if (req.route.path.indexOf('programmer') > -1){
      //    req.query.orderby='pageTitle';
      // } else if (req.route.path.indexOf('movies') > -1){
      //   req.query.maincategory = "Movies";
      //   // Set the default sort option as Most Popular
      //   if (!req.query.orderby) {
      //     req.query.orderby='Score';
      //   }
      //   if(req.query.subcategory && req.query.subcategory.indexOf('Adult') > -1 && req.query.hideAdultContent == 'false'){
      //     req.query.maincategory += ',Adult';
      //     delete req.query.hideAdultContent;
      //   }
      // } else if (req.route.path.indexOf('tv') > -1){
      //   req.query.maincategory = "TV"; 
      //   // Set the default sort option as Most Popular
      //   if (!req.query.orderby) {
      //     req.query.orderby='Score';
      //   }
      // } else if (req.route.path.indexOf('sports') > -1){
      //   req.query.maincategory = "Sports";
      // } 

      // app.appUtils.mapRequestQuery(req);
      
      this.apiCalls[0].params = req.query;
      if (req.query.keyword) 
        this.apiCalls[0].params.keyword = sanitizer.unescapeEntities(req.query.keyword); // need to pass unsanitized keyword to back end, but we don't want other components like reporting code to use the unsanitized version
    },
  };
};