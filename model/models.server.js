
var connectionString = 'mongodb://127.0.0.1:27017/web-dev'; // for local

if(process.env.MLAB_USERNAME_WEBDEV) { // check if running remotely
  var username = process.env.MLAB_USERNAME_WEBDEV; // get from environment
  var password = process.env.MLAB_PASSWORD_WEBDEV;
  var dburl = process.env.MONGODB_URI;
  connectionString = 'mongodb://' + username + ':' + password + '@' + dburl;

}

var mongoose = require("mongoose");
var db = mongoose.connect(connectionString, {
  useMongoClient: true
});

module.exports = db;
