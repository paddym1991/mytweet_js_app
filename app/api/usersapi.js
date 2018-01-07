'use strict';

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//api to find all users
exports.find = {

  //auth: false,
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

//api to find a single user
exports.findOne = {

  //auth: false,
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(user => {
      if (!user) {
        return reply.status(404).end();
      } else {
        reply(user);
      }
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

/**
 * api for creating a single candidate
 * @type {{auth: boolean, handler: exports.create.handler}}
 */
exports.create = {

  //auth: false,
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const user = new User(request.payload);
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      user.password = hash;
      user.save().then(newUser => {
        reply(newUser).code(201);
      }).catch(err => {
        reply(Boom.badImplementation('error creating user'));
      });
    });
  },

};

/**
 * api for deleting all candidates
 * @type {{auth: boolean, handler: exports.deleteAll.handler}}
 */
exports.deleteAll = {

  //auth: false,
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing users'));
    });
  },

};

/**
 * api for deleting a single candidate
 * @type {{auth: boolean, handler: exports.deleteOne.handler}}
 */
exports.deleteOne = {

  //auth: false,
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(user).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.authenticate = {

  auth: false,

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      bcrypt.compare(user.password, foundUser.password, function (err, isValid) {
        if (isValid) {
          reply(foundUser).code(201);
        } else {
          reply(Boom.notFound('internal db failure'));
        }
      }).catch(err => {
        reply(Boom.notFound('internal db failure'));
      });
    });
  },

};

exports.follow = {

  //auth: false,
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let userId = request.params.id;
    let followId = request.payload;
    User.findOne({ _id: userId }).then(user => {
      User.findOne({ _id: followId }).then(followUser => {
        user.following.push(followUser._id);
        followUser.followers.push(user._id);
        followUser.save();
        user.save().then(User => {
          reply(User).code(201);
        });
      });
    }).catch(err => {
      reply(Boom.badImplementation('Error following user'));
    });
  },
};

exports.unfollow = {

  //auth: false,
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let userId = request.params.id;
    const unFollowId = request.payload;
    User.findOne({ _id: userId }).then(user => {
      User.findOne({ _id: unFollowId }).then(unfollowUser => {
        user.following.remove(unFollowId);
        unfollowUser.followers.remove(userId);
        unfollowUser.save();
        user.save().then(User => {
          reply(User).code(201);
        });
      });
    }).catch(err => {
      reply(Boom.badImplementation('Error unfollowing user'));
    });
  },
};

exports.userFollowsTimeline = {

  //auth: false,
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let userId = request.params.id;

    User.findOne({ _id: userId }).then(user => {
      User.findOne({ _id: user.following }).then(followUser => {
        Tweet.find({ tweeter: followUser }).exec().then(tweets => {
          reply(tweets).code(201);
        });
      });
    }).catch(err => {
      reply(Boom.badImplementation('Error retrieving tweets'));
    });
  },
};
