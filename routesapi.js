const UsersApi = require('./app/api/usersapi');
const TweetsApi = require('./app/api/tweetsapi');

module.exports = [

    //find users
  { method: 'GET', path: '/api/users', config: UsersApi.find }, //route for retrieving all users
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne }, //route for retrieving a single user

    //create/delete users
  { method: 'POST', path: '/api/users', config: UsersApi.create },    //route used to create a single user.
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },    //route used to delete a single user (id must be provided)
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },   //route used to delete all users

    //find tweets
  { method: 'GET', path: '/api/tweet', config: TweetsApi.findAllTweets },
  { method: 'GET', path: '/api/tweet/{id}', config: TweetsApi.findOne },

    //create/delete tweets
  { method: 'POST', path: '/api/tweet', config: TweetsApi.createTweet },
  { method: 'DELETE', path: '/api/tweet/{id}', config: TweetsApi.deleteOne },
  { method: 'DELETE', path: '/api/tweet', config: TweetsApi.deleteAllTweets },
];
