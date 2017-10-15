'use strict';

exports.main = {

  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to MyTweet' });
  },

};

exports.signup = {

  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for MyTweet' });   //refactor controller to pass actual title to the view when rendered
  },

};

/**
 * Handler for populating users array (register)
 * @type {{handler: exports.register.handler}}
 */
exports.register = {

  handler: function  (request, reply) {
    reply.redirect('/login');
  },

};

exports.login = {

  handler: function (request, reply) {
    reply.view('login', { title: 'Login to MyTweet' });   //refactor controller to pass actual title to the view when rendered
  },

};

exports.authenticate = {

  handler: function (request, reply) {
    reply.redirect('/home');
  },

};

exports.logout = {

  handler: function (request, reply) {
    reply.redirect('/');
  },

};
