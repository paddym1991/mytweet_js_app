<!--refactor the tweets controller to support making and listing tweets-->

'use strict';

//tweet controller can now require the tweet model
const Tweet = require('../models/tweet');
const User = require('../models/user');   //To gain access to the object reference (user)

exports.home = {

  handler: function (request, reply) {
    reply.view('home', { title: 'Welcome to Tweeterville' });
  },

};

//updates timeline handler to use Tweet model
exports.timeline = {

  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter').then(allTweets => {    //minor update to the timeline handler - with a populate('tweeter') call inserted into the query
      reply.view('timeline', {
        title: 'Tweets to date',
        tweets: allTweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};


//Reimplement the tweet handler to establish the link to the tweet
exports.tweet = {

  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      let data = request.payload;
      const tweet = new Tweet(data);
      tweet.date = new Date();
      tweet.tweeter = user._id;
      return tweet.save();
    }).then(newTweet => {
      reply.redirect('/timeline');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};




