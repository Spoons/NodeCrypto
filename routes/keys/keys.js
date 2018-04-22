const express = require('express'),
      router = express.Router(),
      keysController = require('../../controllers/keys-controller').key_controller,
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      middleware = require('../../middleware/mw');


router.get('/all_keys', keysController.get_all_keys);
router.get('/single_key', keysController.get_single_key);
router.get('/generate/:phrase', keysController.generate_key);

module.exports = router;
