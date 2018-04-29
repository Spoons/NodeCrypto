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
      keysPath = require('./routes/keys/keys'),
      fileUpload = require('express-fileupload'),
      usersPath = require('./routes/users/user'),
      errorPath_NOT_FOUND = require('./routes/error'),
      passport = require('passport'),
      middleware = require('./middleware/mw'),
      fs = require('fs'),
      redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;

// App setup
const app = express();
app.use(bodyParser.urlencoded({extended: true, limit: '250mb'}));
app.use(bodyParser.json({limit: '250mb'}));
app.use(bodyParser({limit: '250mb'}));
app.use(cookieParser());
app.use(express.static(__dirname + '/dist'));
app.use(fileUpload({
  limits: { fieldSize: Math.pow(1024, 3) }, //one gb
}));
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
app.use('/:userID/files', middleware.isAuthenticated, middleware.isAuthenticatedByID, filesPath);
app.use('/users', usersPath);
app.use('/:userID/keys', middleware.isAuthenticated, middleware.isAuthenticatedByID, keysPath);
app.use('*', errorPath_NOT_FOUND);

let USE_SSL = true;
if (USE_SSL) {
  var key = fs.readFileSync('ssl_keys/nodecrypto.pw.key');
  var cert = fs.readFileSync( 'ssl_keys/nodecrypto.pw.crt' );
  var ca = fs.readFileSync( 'ssl_keys/nodecrypto.pw.csr' );

  var ssl_options = {
    key: key,
    cert: cert,
    ca: ca
  };
}


/*(httpApp.set('port', process.env.PORT || 3001);
httpApp.get("*", function (req, res, next) {
    res.redirect("https://" + req.headers.host + req.url);
});
*/

// Server setup & Listen
const https = require('https');
if (USE_SSL) {
  var ssl_server = https.createServer(ssl_options, app);
  ssl_server.listen(process.env.PORT || 3000);
}
/*
var httpApp = express();
httpApp.use(redirectToHTTPS());
const server = http.createServer(httpApp);
server.listen(3001);
*/
