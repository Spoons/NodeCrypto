const express = require('express'),
      router = express.Router()
      userController = require('../../controllers/user-controller').user_controller;


router.get('/register', userController.get_register);
router.get('/login', userController.get_login);
router.get('/:id', userController.user_get);

router.post('/login', userController.login);
router.post('/register', userController.register);
    
module.exports = router;