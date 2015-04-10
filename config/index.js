var nconf = require('nconf');
var path = require('path');


nconf.env();
var env = nconf.get('NODE_ENV');
console.log('NODE_ENV:' + env);

configPath = path.join(__dirname, 'config-'+env+'.json');
nconf.file(configPath);


module.exports = nconf;

