const express = require('express'),
      router = express.Router(),
      keysController = require('../../controllers/keys-controller').key_controller,
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      middleware = require('../../middleware/mw');


router.get('/all_keys', keysController.get_all_keys);
router.get('/single_key/:pref_key', keysController.get_single_key);
router.post('/store', keysController.store_keys);
router.use('/associate', keysController.update_file_key);

module.exports = router;
