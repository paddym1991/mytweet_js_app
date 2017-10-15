<!--refactor the tweets controller to support making and listing tweets-->

'use strict';

exports.home = {

  handler: function (request, reply) {
    reply.view('home', { title: 'Welcome to Tweeterville' });
  },

};

//retrieve tweets array
exports.timeline = {

  handler: function (request, reply) {
    reply.view('timeline', {
      title: 'Tweets to Date',
      tweets: this.tweets,
    });
  },

};

//store tweet in tweets array (created in index.js)
exports.tweet = {

  handler: function (request, reply) {
    const data = request.payload;
    this.tweets.push(data);
    reply.redirect('/timeline');
  },

};
