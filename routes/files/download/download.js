const express = require('express'),
      router = express.Router(),
      file_controller = require('../../../controllers/file-controller').file_controller;

router.post('/', file_controller.file_download);
router.post('/raw', file_controller.file_download_raw);

module.exports = router;