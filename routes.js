const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');
const Accounts = require('./app/controllers/accounts');
const Admin = require('./app/controllers/admin');

module.exports = [

  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'GET', path: '/timeline', config: Tweets.timeline },
  { method: 'POST', path: '/tweet', config: Tweets.tweet },    //POST route to accept tweets
  { method: 'POST', path: '/deletetweet', config: Tweets.deletetweet },
  { method: 'GET', path: '/searchuser', config: Tweets.searcheduser },
  { method: 'POST', path: '/searcheduser', config: Tweets.searchusertweets },
  { method: 'GET', path: '/loggedinusertimeline', config: Tweets.loggedInUserTimeline },

  { method: 'GET', path: '/getpicture/{_id}', config: Tweets.getpicture },
  { method: 'GET', path: '/follow/{id}', config: Tweets.follow },
  { method: 'GET', path: '/unfollow/{id}', config: Tweets.unfollow },

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
  { method: 'POST', path: '/profilePic', config: Accounts.profilePic },
  { method: 'GET', path: '/getPic/{id}', config: Accounts.getPic },

  { method: 'GET', path: '/admindash', config: Admin.main },
  { method: 'GET', path: '/registeruseradmin', config: Admin.registeruseradmin },
  { method: 'POST', path: '/adminRegister', config: Admin.adminRegister },
  { method: 'GET', path: '/adminDeleteUser/{_id}', config: Admin.adminDeleteUser },

];
