// this contains poc-specific settings - it will override /lib/config/config.default.js
module.exports = {
  appName: 'POC 1.5',
  appAcronym: 'poc',
	timeout: 30000,
  nodetime_app: 'DTV-POC 1.5: TEST',

  log_dir: '/app/log/node/poc-node',
  
  redirect_unknown_to_login_server: false,
  
  dump_errors: true
};
