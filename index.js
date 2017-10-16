'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 4000 });

/**
 * store a list of users and tweets in a simple array
 */
server.bind({
  currentUser: {},
  users: [],
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

  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'donation-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
  });

  server.route(require('./routes'));

  server.start(err => {
    if (err) {
      throw err;
    }

    console.log('Server listening at:', server.info.uri);
  });

});
