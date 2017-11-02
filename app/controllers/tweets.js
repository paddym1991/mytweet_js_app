<!--refactor the tweets controller to support making and listing tweets-->

'use strict';

//tweet controller can now require the tweet model
const Tweet = require('../models/tweet');
const User = require('../models/user');   //To gain access to the object reference (user)
const Joi = require('joi');

exports.home = {

  handler: function (request, reply) {
    reply.view('home', { title: 'Welcome to Tweeterville' });
  },

};

//updates timeline handler to use Tweet model
exports.timeline = {

  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {    //minor update to the timeline handler - with a populate('tweeter') call inserted into the query
      reply.view('timeline', {
        title: 'Tweets to date',
        tweets: allTweets,
      });
      console.log('All Tweets');
      console.log(allTweets);   //logs all tweets to console
    }).catch(err => {
      reply.redirect('/');
    });
  },

};


//Reimplement the tweet handler to establish the link to the tweet
exports.tweet = {
  auth: false,

  validate: {

    //This defines a schema which defines rules that our fields must adhere to
    payload: {
      tweetText: Joi.string().required(),
    },

    //This is the handler to invoke if one or more of the fields fails the validation
    failAction: function (request, reply, source, error) {
      reply.view('home', {
        title: 'Tweet error',
        errors: error.data.details,
      }).code(400);
    },

    //have the component report all errors and not just one
    options: {
      abortEarly: false,
    },

  },

  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      let data = request.payload;
      const tweet = new Tweet(data);
      tweet.date = new Date();
      tweet.tweeter = user._id;
      return tweet.save();
    }).then(newTweet => {
      console.log('New Tweet');
      console.log(newTweet);    //logs the new tweet to console.
      reply.redirect('/timeline');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

/**
 * Handler to delete tweet/tweets by id
 * @type {{handler: exports.deletetweet.handler}}
 */
exports.deletetweet = {
  handler: function (request, reply) {
    const tweets = Object.keys(request.payload);
    tweets.forEach(function (id) {
      Tweet.findByIdAndRemove(id, function (err) {
        if (err) throw err;
        console.log('Deleted id: ' + id);
      });
    });

    reply.redirect('/timeline');

  },
};




