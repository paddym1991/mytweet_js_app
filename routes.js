const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');
const Accounts = require('./app/controllers/accounts');
const Admin = require('./app/controllers/admin');

module.exports = [

  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'GET', path: '/timeline', config: Tweets.timeline },
  { method: 'POST', path: '/tweet', config: Tweets.tweet },    //POST route to accept tweets
  { method: 'POST', path: '/deletetweet', config: Tweets.deletetweet },

    //to serve all files in the assets folder
  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/register', config: Accounts.register },   //Post route to register users
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: 'GET', path: '/admindash', config: Admin.main },
  { method: 'POST', path: '/admindash/adminRegister', config: Admin.adminRegister },
  { method: 'POST', path: '/admindash/adminDeleteUser', config: Admin.adminDeleteUser },

];
