'use strict';

//account controller can now require the user model
const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

  validate: {

    //This defines a schema which defines rules that our fields must adhere to
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    //This is the handler to invoke if one or more of the fields fails the validation
    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

    //have the component report all errors and not just one
    options: {
      abortEarly: false,
    },

  },

  handler: function  (request, reply) {
    const user = new User(request.payload);
    const plaintextPassword = user.password;

    bcrypt.hash(plaintextPassword, saltRounds, function (err, hash) {
      user.password = hash;
      user.save().then(newUser => {
        reply.redirect('/login');
      }).catch(err => {
        reply.redirect('/');
      });
      console.log('this is registering');
      console.log(user);
    });
  },

};

/**
 * direct user to the login page
 * @type {{auth: boolean, handler: exports.login.handler}}
 */
exports.login = {

  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to MyTweet' });   //refactor controller to pass actual title to the view when rendered
  },

};

//updated to consult the database when validating a user
exports.authenticate = {
  auth: false,

  validate: {

    //This defines a schema which defines rules that our fields must adhere to
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    //This is the handler to invoke if one or more of the fields fails the validation
    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Login error',
        errors: error.data.details,
      }).code(400);
    },

    //have the component report all errors and not just one
    options: {
      abortEarly: false,
    },

  },

  handler: function (request, reply) {
    //login details passed in to form
    const user = request.payload;

    //check if any users in db match the email passed in. If so they become the foundUser
   // User.findOne({email: user.email}).then(foundUser => {
      //if the found user's details match the admin account then log in as admin
      if ((user.email == 'admin@istrator.com') && (user.password == 'secret')) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: user.email,
        });
        console.log('Admin authenticating');
        //console.log(foundUser);
        reply.redirect('/admindash');

        //if found user's details match any other user then log them in as a normal user
        // }else if (foundUser && foundUser.password === user.password) {
        //   request.cookieAuth.set({    //setting a session cookie after user credentials are verified
        //     loggedIn: true,
        //     loggedInUser: user.email,
        //   });
        //   console.log('User is authenticating');
        //   console.log(foundUser);
        //   reply.redirect('/home');
        // } else {
        //   reply.redirect('/signup');
        // }
      } else {
        User.findOne({email: user.email}).then(foundUser => {
          bcrypt.compare(user.password, foundUser.password, function (err, isValid) {
            if (isValid) {
              request.cookieAuth.set({
                loggedIn: true,
                loggedInUser: user.email,
              });
              reply.redirect('/home');
            } else {
              reply.redirect('/signup');
            }
          });
        }).catch(err => {
          reply.redirect('/');
        });
      }
    },
};

/**
 * Clear the cookie and redirect user to main page when logout chosen
 * @type {{auth: boolean, handler: exports.logout.handler}}
 */
exports.logout = {

  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();   //clear the session(clear cookie) upon logout
    reply.redirect('/');
  },

};

/**
 * Handler to view settings page of user retrieved from database
 * @type {{handler: exports.viewSettings.handler}}
 */
exports.viewSettings = {

  handler: function (request, reply) {
    console.log('Update settings page');
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      console.log(foundUser);
      reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

/**
 * Handler to update settings
 * Read a users details from the database, and then update with new values entered by the user
 * @type {{handler: exports.updateSettings.handler}}
 */
exports.updateSettings = {

  validate: {

    //This defines a schema which defines rules that our fields must adhere to
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    //This is the handler to invoke if one or more of the fields fails the validation
    failAction: function (request, reply, source, error) {
      const loggedInUserEmail = request.auth.credentials.loggedInUser;
      User.findOne({ email: loggedInUserEmail }).then(foundUser => {
        console.log(foundUser);
        reply.view('settings', {
          title: 'Update settings error',
          errors: error.data.details,
          user: foundUser,
        }).code(400);
      });
    },

    //have the component report all errors and not just one
    options: {
      abortEarly: false,
    },

  },

  handler: function (request, reply) {
    const editedUser = request.payload;
    const loggedInUserEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: loggedInUserEmail }).then(user => {
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      // user.password = editedUser.password;
      // return user.save();     //return a promise from the save() function - and then re render the updated user details to the settings view.
      bcrypt.hash(editedUser.password, saltRounds, function (err, hash) {
        user.password = hash;
        user.save();
      });

      return user;
    }).then(user => {
      console.log(user.firstName + "'s account edited");
      console.log(user);
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    });
  },

};

exports.profilePic = {
  handler: function (request, response) {
    let loggedInUserEmail = request.auth.credentials.loggedInUser;
    let profilePic = request.payload.picture;
    User.findOne({ email: loggedInUserEmail }).then(user => {
      if (profilePic.length) {
        user.picture.data = profilePic;
        user.save();
      }
      response.redirect('/settings');
    }).catch(err => {
      response.redirect('/');
    });
  },
};

exports.getPic = {
  handler: function (request, response) {
    let userId = request.params.id;
    User.findOne({ _id: userId }).then(user => {
      response(user.picture.data).type('image');
    }).catch(err => {
      response.redirect('/');
    });
  },
};
