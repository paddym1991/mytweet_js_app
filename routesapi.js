const UsersApi = require('./app/api/usersapi');

module.exports = [
  { method: 'GET', path: '/api/users', config: UsersApi.find },
];
