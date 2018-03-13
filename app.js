/*jshint esversion: 6*/
(function(){
  'use strict';
})();

// Dependencies
const express = require('express'),
      path = require('path'),
      http = require('http'),
      bodyParser = require('body-parser'),
      rootPath = require('./routes/root'),
      filesPath = require('./routes/files/files'),
      fileUpload = require('express-fileupload'),
      usersPath = require('./routes/users/user'),
      passport = require('passport'),
      LocalStrategy = require('pasport-local').Strategy;

// App setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(fileUpload());
app.set('view engine','ejs');


// App routing
app.use('/', rootPath);
app.use('/files', filesPath)
app.use('/users', usersPath)

// Server setup & Listen
const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, (data) => {
    console.log(data);
});
