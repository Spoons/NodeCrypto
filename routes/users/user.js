const express = require('express'),
      router = express.Router(),
      userController = require('../../controllers/user-controller').user_controller,
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      middleware = require('../../middleware/mw');


router.get('/register', userController.get_register);
router.get('/login', userController.get_login);
router.get('/logout', middleware.isAuthenticated, userController.logout);
router.get('/:userID', middleware.isAuthenticated, middleware.isAuthenticatedByID, userController.user_get);


router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}), userController.login);
router.post('/register', userController.register);
    
module.exports = router;