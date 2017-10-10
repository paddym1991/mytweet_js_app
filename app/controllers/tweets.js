'use strict';

exports.home = {

  handler: (request, reply) => {
    reply.view('main', { title: 'Welcome to Tweeterville' });   //refactor controller to pass actual title to the view when rendered
  },
};

exports.signup = {

  handler: (request, reply) => {
    reply.view('signup', { title: 'Sign up for MyTweet' });   //refactor controller to pass actual title to the view when rendered
  },
};

exports.login = {

  handler: (request, reply) => {
    reply.view('login', { title: 'Login to MyTweet' });   //refactor controller to pass actual title to the view when rendered
  },
};

