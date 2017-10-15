<!--refactor the tweets controller to support making and listing donations-->

'use strict';

exports.home = {

  handler: function (request, reply) {
    reply.view('home', { title: 'Welcome to Tweeterville' });
  },

};

exports.timeline = {

  handler: function (request, reply) {
    reply.view('report', { title: 'Tweets to Date', });
  },

};

exports.tweet = {

  handler: function (request, reply) {
    reply.redirect('/timeline');
  },

};
