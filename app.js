/*jshint esversion: 6*/
(function(){
  'use strict';
})();

// Dependencies
const express = require('express'),
      path = require('path'),
      http = require('http'),
      bodyParser = require('body-parser'),
      routes = require('./routes/main');

// App setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

// App routing
app.use('/', routes);

// Server setup & Listen
const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, (data) => {
    console.log(data);
});

/*
*   NOTES:
*   Route structure subject to change, will likely seperate routing between non-public API and public routes
*   Directories will need to be set up for static assets, this will go in the "public" folder.
*   DB connection is uncertain, but we will likely be using SQL, in which case there are a few npm packages to choose from
*/