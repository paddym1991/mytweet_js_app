const Tweets = require('./app/controllers/tweets');

module.exports = [

  { method: 'GET', path: '/', config: Tweets.home },

];
