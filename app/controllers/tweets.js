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

    let loggedInUserEmail = request.auth.credentials.loggedInUser;

    //find all tweets
    Tweet.find({}).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {    //minor update to the timeline handler - with a populate('tweeter') call inserted into the query
      //find logged in user
      User.findOne({ email: loggedInUserEmail }).then(foundUser => {
        console.log(loggedInUserEmail);
        //if logged in user is admin then display admin timeline view
        if (foundUser.email === 'admin@istrator.com') {
          reply.view('global_timeline_admin', {
            title: 'Tweets to date',
            tweets: allTweets,
          });
          //if logged in user is normal user then display timeline view
        } else {
          reply.view('timeline', {
            title: 'Tweets to date',
            tweets: allTweets,
          });
          //logs all tweets to console
          console.log('All Tweets');
          console.log(allTweets);
        }
    }).catch(err => {
      reply.redirect('/');
    });
  });

  },

};


//Reimplement the tweet handler to establish the link to the tweet
exports.tweet = {

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
    console.log(userEmail);
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

    let loggedInUserEmail = request.auth.credentials.loggedInUser;
    console.log(loggedInUserEmail);

    const tweets = Object.keys(request.payload);
    tweets.forEach(function (id) {
      Tweet.findByIdAndRemove(id, function (err) {
        if (err) throw err;
        console.log('Deleted id: ' + id);
      });
    });
    //page is redirected based on who is logged in
    User.findOne({ email: loggedInUserEmail }).then(foundUser => {
      console.log(loggedInUserEmail);
      // if (foundUser.email === 'admin@istrator.com') {
      //   reply.redirect('/timeline');
      // } else {
        reply.redirect('/timeline');
      //}
    })

  },
};

/**
 * Directs user to searched users page
 * @type {{handler: exports.searcheduser.handler}}
 */
exports.searcheduser = {

  handler: function (request, reply) {
    reply.view('searcheduser', { title: 'Search for user Tweets' });
  },

};

/**
 * find all tweets by users email address. Send user to the searched users timeline
 * @type {{handler: exports.searchusertweets.handler}}
 */
exports.searchusertweets = {

  handler: function (request, reply) {
    let findUserEmail = request.payload.useremail;
    console.log(findUserEmail);
    let user = User.findOne({email: findUserEmail});
    console.log(user);
    // Tweet.find({tweeter: user}).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {    //minor update to the timeline handler - with a populate('tweeter') call inserted into the query
    //   reply.view('searchuser', {
    //     title: 'Tweets to date',
    //     tweets: allTweets,
    //   });
    //   console.log('All Tweets');
    //   console.log(allTweets);   //logs all tweets to console
    // }).catch(err => {
    //   reply.redirect('/');
    // });
    User.findOne({ email: findUserEmail }).then(foundUser => {
      Tweet.find({tweeter: foundUser._id}).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {
        reply.view('searcheduser', {
          title: 'Tweets to date',
          user: foundUser,
          tweets: allTweets,
        });
        console.log('All Tweets');
        console.log(allTweets);   //logs all tweets to console
      })
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/**
 * handler to direct user to their own timeline with a list of their tweets.
 * @type {{handler: exports.loggedInUserTimeline.handler}}
 */
exports.loggedInUserTimeline = {

  handler: function (request, reply) {
    let loggedInUserEmail = request.auth.credentials.loggedInUser;
    let user = User.findOne({email: loggedInUserEmail});
    User.findOne({ email: loggedInUserEmail }).then(foundUser => {
      Tweet.find({tweeter: foundUser._id}).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {
        reply.view('loggedinusertimeline', {
          title: 'My Tweets to Date',
          user: foundUser,
          tweets: allTweets,
        });
        console.log('All My Tweets');
        console.log(allTweets);
      })
    }).catch(err => {
      console.log(err);
      reply.redirect('/');
    });
  },
};


