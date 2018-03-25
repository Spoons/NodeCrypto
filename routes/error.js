const express = require('express'),
      router = express.Router(),
      appController = require('../controllers/app-controller').app_controller;

router.get('*', appController.error_render);
    
module.exports = router;