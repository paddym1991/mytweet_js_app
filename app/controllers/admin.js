'use strict'

const Tweet = require('../models/tweet');
const User = require('../models/user');
const Joi = require('joi');

exports.main = {
  handler: function (request, reply) {
    User.find({}).then(allUsers => {
      Tweet.find({}).populate('user').populate('tweeter').sort({ date: 'desc' }).then(allTweets => {
        reply.view('admindash', {
          title: 'Admin Dashboard',
          users: allUsers,
          tweets: allTweets,
        });
      });
    });
  },
};

exports.registeruseradmin = {

  handler: function (request, reply) {
    reply.view('register_user_admin', { title: 'Register a user' });
  },

};

/**
 * Handler for populating users in database
 * @type {{handler: exports.register.handler}}
 */
exports.adminRegister = {
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
      reply.view('admindash', {
        title: 'error registering user as admin',
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

    user.save().then(newUser => {
      reply.redirect('/admindash');
    }).catch(err => {
      reply.redirect('/');
    });
    console.log('registering user as admin');
    console.log(user);
  },

};

/**
 * Handler for admin to delete a user from db
 * @type {{handler: exports.adminDeleteUser.handler}}
 */
exports.adminDeleteUser = {
  handler: function (request, reply) {
    const userId = request.payload.users;
    Tweet.remove({ user: userId }).then(removeTweetSuccess => {
      console.log('User Tweets removed:', userId);
      return User.findByIdAndRemove({ _id: userId });
    }).then(removeUserSuccess => {
      console.log('User removed:', userId);
      reply.redirect('/admindash');
    }).catch(err => {
      reply.redirect('/admindash');
    });
  },
};
