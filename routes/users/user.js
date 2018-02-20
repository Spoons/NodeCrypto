const express = require('express'),
      router = express.Router()
      userController = require('../../controllers/user-controller');

router.get('/:id', userController.user_id_get);
    
module.exports = router;