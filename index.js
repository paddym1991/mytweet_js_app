'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 4000 });

//initialising inert and vision plugins
server.register([require('inert'), require('vision')], err=> {

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

  server.route(require('./routes'));

  server.start(err => {
    if (err) {
      throw err;
    }

    console.log('Server listening at:', server.info.uri);
  });

});
