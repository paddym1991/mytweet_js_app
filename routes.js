const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');

module.exports = [

  { method: 'GET', path: '/', config: Tweets.home },

    //to serve all files in the assets folder
  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

  { method: 'GET', path: '/signup', config: Tweets.signup },
  { method: 'GET', path: '/login', config: Tweets.login },

];
