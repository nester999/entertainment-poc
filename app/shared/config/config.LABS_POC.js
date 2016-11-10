
module.exports = {
  // api_host: 'localhost:9010', // stage-dpdlabs.directv.com:9010, dev-dpdlabs.directv.com:9010
  api_host: 'stage-dpdlabs.directv.com:9010', //dev-dpdlabs.directv.com:9010
  login_server: 'https://adapt.directv.com',
  teamsite_server: 'http://adapt.directv.com',

  redis_cache: false, // setting to false for now until we resolve redis sharing between labs node instances
  redis_host: '10.1.16.140',
  redis_port: 6379,
};