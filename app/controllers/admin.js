'use strict'

const Tweet = require('../models/tweet');
const User = require('../models/user');
const Joi = require('joi');

exports.main = {
  handler: function (request, reply) {
    User.find({}).then(allUsers => {
      Tweet.find({}).populate('user').then(allTweets => {
        reply.view('admindash', {
          title: 'Admin settings',
          users: allUsers,
          tweets: allTweets,
        });
      });
    });
  },
};
