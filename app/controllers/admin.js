'use strict'

const Tweet = require('../models/tweet');
const User = require('../models/user');
const Joi = require('joi');

exports.main = {
  handler: function (request, reply) {
    User.find({}).then(allUsers => {
      Tweet.find({}).populate('user').then(allTweets => {
        reply.view('admindash', {
          title: 'Admin Dashboard',
          users: allUsers,
          tweets: allTweets,
        });
      });
    });
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
    const data = request.payload.users;
    let users = [];
    if (request.payload.users.constructor !== Array) {
      users.push(data);
    } else {
      users = data;
    }

    Tweet.find({ user: users }).then(foundTweets => {
      // delete tweets individually
      foundTweets.forEach(function (id) {
        Tweet.findByIdAndRemove(id, function (err) {
          if (err) throw err;
        });
      });

      return null;
    }).then(nothing => {
      // delete user(s)
      console.log(users);
      users.forEach(function (userId) {
        User.findByIdAndRemove(userId, function (err) {
          if (err) throw err;
        });

        return null;
      });
    }).then(nothing => {
      reply.redirect('/admindash', {
        title: 'Deleted User(s)',
      });
    });
  },

};
