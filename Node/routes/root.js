const express = require('express'),
      router = express.Router(),
      appController = require('../controllers/app-controller');

router.get('/', appController.index_get);
    
module.exports = router;