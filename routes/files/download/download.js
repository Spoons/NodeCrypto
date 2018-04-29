const express = require('express'),
      router = express.Router(),
      file_controller = require('../../../controllers/file-controller').file_controller;

router.post('/', file_controller.file_download);

module.exports = router;
