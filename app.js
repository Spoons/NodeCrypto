/*jshint esversion: 6*/
(function(){
  'use strict';
})();

// Dependencies
const express = require('express'),
      path = require('path'),
      http = require('http'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      expressSession = require('express-session'),
      expressValidator = require('express-validator'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      flash = require('connect-flash'),
      secret = require('./secret'),
      rootPath = require('./routes/root'),
      filesPath = require('./routes/files/files'),
      fileUpload = require('express-fileupload'),
      usersPath = require('./routes/users/user');

// App setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(__dirname + '/dist'));
app.use(fileUpload());
app.set('view engine','ejs');

// Auth setup - session / validator
app.use(expressSession({
    secret: secret,
    saveUninitialized: true,
    resave: true
}));

app.use(expressValidator({
    errorFormatter: (params, message, val) => {
        return {
            param: params,
            msg: message,
            value: val
        };
    }
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Set up flash messages 
app.use(flash());

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// App routing
app.use('/', rootPath);
app.use('/files', filesPath)
app.use('/users', usersPath)

// Server setup & Listen
const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, (data) => {
});
