const express = require('express'),
      router = express.Router()
      userController = require('../../controllers/user-controller');

router.get('/signup', userController.user_signup_get);
router.post('/signup', userController.user_signup_post);
router.get('/:id', userController.user_id_get);

module.exports = router;
