'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 4000 });

/**
 * store a list of users and tweets in a simple array
 */
server.bind({
  //currentUser: {},   //will be using alternative mechanism to track the user
  users: {},    //changed users to store an object instead of array
  tweets: [],
});

//initialising/registering inert, vision and cookie plugins
server.register([require('inert'), require('vision'), require('hapi-auth-cookie')], err=> {

  if (err) {
    throw err;
  }

  //assign handlebars engine for views to the server
  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    //extend vision initialisation
    layoutPath: './app/views/layout',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  /**
   * Defining cookie strategy
   */
  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'tweet-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
    redirectTo: '/login',     //if cookie expires or gets deleted redirect user to login page.
  });

  //Cookie set as strategy for all routes.
  //App will be disabled as all routes are protected (looking for a cookie)
  server.auth.default({
    strategy: 'standard',
  });

  server.route(require('./routes'));

  server.start(err => {
    if (err) {
      throw err;
    }

    console.log('Server listening at:', server.info.uri);
  });

});
