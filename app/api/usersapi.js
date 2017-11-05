'use strict';

const User = require('../models/user');
const Boom = require('boom');

//api to find all users
exports.find = {

  auth: false,

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

  auth: false,

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(user => {
      if (!user) {
        return reply.status(404).end();
      }

      reply(user);
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

  auth: false,

  handler: function (request, reply) {
    const user = new User(request.payload);
    user.save().then(newUser => {
      reply(newUser).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating user'));
    });
  },

};

/**
 * api for deleting all candidates
 * @type {{auth: boolean, handler: exports.deleteAll.handler}}
 */
exports.deleteAll = {

  auth: false,

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

  auth: false,

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(user).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

