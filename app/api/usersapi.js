'use strict';

const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils.js');

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
      if (foundUser && foundUser.password === user.password) {
        const token = utils.createToken(foundUser);
        reply({ success: true, token: token }).code(201);
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
      }
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },

};

