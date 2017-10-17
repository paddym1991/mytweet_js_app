'use strict';

//account controller can now require the user model
const User = require('../models/user');

exports.main = {

  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to MyTweet' });
  },

};

exports.signup = {

  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for MyTweet' });   //refactor controller to pass actual title to the view when rendered
  },

};

/**
 * Handler for populating users in database
 * @type {{handler: exports.register.handler}}
 */
exports.register = {

  auth: false,
  handler: function  (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
    console.log('this is registering');
    console.log(user);
  },

};

exports.login = {

  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to MyTweet' });   //refactor controller to pass actual title to the view when rendered
  },

};

//updated to consult the database when validating a user
exports.authenticate = {

  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        request.cookieAuth.set({    //setting a session cookie after user credentials are verified
          loggedIn: true,
          loggedInUser: user.email,
        });
        console.log('this is authenticating');
        console.log(foundUser);
        reply.redirect('/home');
      } else {
        reply.redirect('/signup');
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.logout = {

  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();   //clear the session(clear cookie) upon logout
    reply.redirect('/');
  },

};

/**
 * Handler to view settings page
 * @type {{handler: exports.viewSettings.handler}}
 */
exports.viewSettings = {

  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    const currentUserDetails = this.users[userEmail];
    reply.view('settings', { title: 'Edit Account Settings', user: currentUserDetails });
  },

};

/**
 * Handler to update settings
 * @type {{handler: exports.updateSettings.handler}}
 */
exports.updateSettings = {

  handler: function (request, reply) {
    const user = request.payload;
    this.users[user.email] = user;
    reply.redirect('/settings');
  },

};
