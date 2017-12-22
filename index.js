'use strict';

const Hapi = require('hapi');

//make app accessible from an SPA. import 'hapi-cors'
const corsHeaders = require('hapi-cors-headers');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 4000 });

//define a new strategy, which will be in addition to the strategy already in place
const utils = require('./app/api/utils.js');

//deleted existing server objects above and replaced with an import of the db just created
require('./app/models/db');

// initialising/registering inert, vision and cookie plugins
server.register([require('inert'), require('vision'), require('hapi-auth-cookie'), require('hapi-auth-jwt2')], err=> {

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

  /**
   * define a new strategy, which will be in addition to the strategy already in place.
   * 'validateFunc' is specified here as part of the strategy
   */
  server.auth.strategy('jwt', 'jwt', {
    key: 'secretpasswordnotrevealedtoanyone',
    validateFunc: utils.validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  //Cookie set as strategy for all routes.
  //App will be disabled as all routes are protected (looking for a cookie)
  //Some routes have set auth to false to counter this and prevent app from crashing
  server.auth.default({
    strategy: 'standard',
  });

  server.route(require('./routes'));
  //include routeapi route into the application server
  server.route(require('./routesapi'));

  server.start(err => {
    if (err) {
      throw err;
    }

    console.log('Server listening at:', server.info.uri);
  });

});
