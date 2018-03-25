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
      auth_config = require('./config/passport'),
      flash = require('connect-flash'),
      secret = require('./secret'),
      rootPath = require('./routes/root'),
      filesPath = require('./routes/files/files'),
      fileUpload = require('express-fileupload'),
      usersPath = require('./routes/users/user'),
      errorPath_NOT_FOUND = require('./routes/error'),
      passport = require('passport'),
      middleware = require('./middleware/mw');

// App setup
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
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
auth_config(app);

// Set up flash messages
app.use(flash());

app.use((req,res,next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// App routing
app.use('/', rootPath);
app.use('/files', middleware.isAuthenticated, filesPath);
app.use('/users', usersPath);
app.use('*', errorPath_NOT_FOUND);


// Server setup & Listen
const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, (data) => {
});
