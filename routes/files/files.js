const express = require('express'),
      router = express.Router()
      fileController = require('../../controllers/file-controller').file_controller;
      upload_routes = require('./uploads/upload');

router.get('/', fileController.file_route_get);

router.get('/file/:id', fileController.file_id_get);

router.get('/file/transfer/:id', fileController.file_transfer_get);

router.use('/upload', upload_routes);

module.exports = router;
