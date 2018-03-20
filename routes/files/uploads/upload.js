const express = require('express'),
      router = express.Router(),
      multer = require('multer'),
      upload = multer(),
      file_controller = require('../../../controllers/file-controller').file_controller;

// WIP: Uploads file and parses data, sends to model, will eventually send to controller
router.post('/', upload.single('uploadedFile'), file_controller.upload_file);

module.exports = router;
