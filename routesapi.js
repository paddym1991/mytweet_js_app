const UsersApi = require('./app/api/usersapi');

module.exports = [
  { method: 'GET', path: '/api/users', config: UsersApi.find }, //route for retrieving all users
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne }, //route for retrieving a single user
];
