'use strict';

/**
 * Class of functions that will test any endpoints of the tweet model of the API
 */

const Tweet = require('../models/tweet');
const Boom = require('boom');

//api method to find one tweet
exports.findOne = {
  auth: false,
  handler: function (req, res) {
    Tweet.findOne({ _id: req.params.id }).then(tweet => {
      res(tweet);
    }).catch(err => {
      res(Boom.notFound('Error finding tweet id: ' + err));
    });
  },
};

//api method to find all tweets
exports.findAll = {
  auth: false,
  handler: function (req, res) {
    Tweet.find({}).exec().then(tweets => {
      res(tweets);
    }).catch(err => {
      res(Boom.badImplementation('Error accessing database: ' + err));
    });
  },
};

//api method to create a new tweet
exports.addNewTweet = {
  auth: false,
  handler: function (req, res) {
    const tweet = new Tweet(req.payload);
    tweet.save().then(newTweet => {
      res(newTweet).code(201);//201: HTTP code for resource created
    }).catch(err => {
      res(Boom.badImplementation('Error creating new tweet: ' + err));
    });
  },
};

//api method to delete one tweet
exports.deleteOne = {
  auth: false,
  handler: function (req, res) {
    Tweet.remove({_id: req.params.id}).then(tweet => {
      res(tweet).code(204);//204: code for no content, ensures deletion
    }).catch(err => {
      res(Boom.notFound('Error finding tweet id: ' + err));
    });
  },
};

//api method to delete all tweets
exports.deleteAll = {
  auth: false,
  handler: function (req, res) {
    Tweet.remove({}).then(err => {
      res().code(204);
    }).catch(err => {
      res(Boom.badImplementation('Error deleting tweets: ' + err));
    });
  },
};
