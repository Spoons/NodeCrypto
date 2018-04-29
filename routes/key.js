const express = require('express'),
      router = express.Router(),
      keys_controller = require('../controllers/keys-controller').key_controller;

router.get('retrieve/:id', keys_controller.get_key_by_id);
