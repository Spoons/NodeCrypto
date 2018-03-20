const express = require('express'),
      router = express.Router(),
      userController = require('../../controllers/user-controller').user_controller,
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;


router.get('/register', userController.get_register);
router.get('/login', userController.get_login);
router.get('/logout', userController.logout);
router.get('/:id', userController.user_get);


router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}), userController.login);
router.post('/register', userController.register);
    
module.exports = router;