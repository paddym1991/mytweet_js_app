<!--refactor the tweets controller to support making and listing tweets-->

'use strict';

//tweet controller can now require the tweet model
const Tweet = require('../models/tweet');

exports.home = {

  handler: function (request, reply) {
    reply.view('home', { title: 'Welcome to Tweeterville' });
  },

};

//updates timeline handler to use Tweet model
exports.timeline = {

  handler: function (request, reply) {
    Tweet.find({}).exec().then(allTweets => {
      reply.view('timeline', {
        title: 'Tweets to date',
        tweets: allTweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};


//updated tweet handler to use Tweet model
exports.tweet = {

  handler: function (request, reply) {
    let data = request.payload;
    const tweet = new Tweet(data);
    tweet.save().then(newTweet => {
      reply.redirect('/timeline');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};



