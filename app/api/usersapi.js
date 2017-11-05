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

