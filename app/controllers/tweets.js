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
    let data = request.payload;
    const tweeterEmail = request.auth.credentials.loggedInUser; //recover tweeter email from cookie
    data.tweeter = this.users[tweeterEmail];    //setting current user as tweeter
    this.tweets.push(data);
    reply.redirect('/timeline');
  },

};
