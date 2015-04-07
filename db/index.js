var mongoose = require('mongoose');
//var tweetSchema = require('./schemas/tweet.js');
//var userSchema = require('./schemas/user.js');


var config = require('../config');

var connection = mongoose.createConnection(config.get('database:host'), config.get('database:name'), config.get('database:port'));

//connection.model('User', userSchema);
//connection.model('Tweet', tweetSchema);

// database test
//console.log("Connection:", connection)

module.exports = connection;
