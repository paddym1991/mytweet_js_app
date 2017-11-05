const UsersApi = require('./app/api/usersapi');

module.exports = [
  { method: 'GET', path: '/api/users', config: UsersApi.find }, //route for retrieving all users
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne }, //route for retrieving a single user

  { method: 'POST', path: '/api/users', config: UsersApi.create },    //route used to create a single user.
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },    //route used to delete a single user (id must be provided)
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },   //route used to delete all users
];
