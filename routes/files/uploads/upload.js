const express = require('express'),
      router = express.Router(),
      multer = require('multer'),
      upload = multer(),
      FileController = require('../../../controllers/file-controller');

// WIP: Uploads file and parses data, sends to model, will eventually send to controller
router.post('/', upload.single('uploadedFile'), FileController.file_controller.upload_file);

module.exports = router;
