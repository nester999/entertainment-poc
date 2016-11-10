requireFromRoot = function requireFromRoot(resource) {
  return require(__dirname + '/' + resource);
};

var appComponents = [];

var config = requireFromRoot('lib/config/configmanager')();

var pocMiddleware = requireFromRoot('app/components/poc-middleware')();
config.topMiddleware    = pocMiddleware.top;
config.staticMiddleware = pocMiddleware.static;

var appLib = requireFromRoot('/lib/framework/appLib')(config, appComponents);

// Export the application as a module - used by grunt testServer
module.exports = appLib.createApp;

// Start the application if this is the main process
if (module === require.main) appLib.main();

