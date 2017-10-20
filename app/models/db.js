'use strict';

const mongoose = require('mongoose');
//Turning on ES6 promises  in order to remove the following warning from console:
// "node:50475) DeprecationWarning: Mongoose: mpromise (mongoose's default promise library)
//is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html"
mongoose.Promise = global.Promise;

let dbURI = 'mongodb://localhost/mytweet';    //mongodb://tweetuser:tweetuser@ds227035.mlab.com:27035/mytweet
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

/**
 * Pre-load database on startup from data.json
 */
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
  if (process.env.NODE_ENV != 'production') {
    var seeder = require('mongoose-seeder');
    const data = require('./data.json');
    const Tweet = require('./tweet');
    const User = require('./user');
    seeder.seed(data, { dropDatabase: false, dropCollections: true }).then(dbData => {
      console.log('preloading Test Data');
      console.log(dbData);
    }).catch(err => {
      console.log(error);
    });
  }
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});
