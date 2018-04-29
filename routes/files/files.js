const express = require('express'),
      router = express.Router()
      fileController = require('../../controllers/file-controller').file_controller;
      upload_routes = require('./uploads/upload'),
      download_route = require('./download/download');

router.get('/', fileController.file_route_get);

router.get('/file/:id', fileController.file_id_get);

router.use('/file/:id/download', download_route);

router.get('/file/transfer/:id', fileController.file_transfer_get);

router.use('/upload', upload_routes);

router.use('/files', fileController.get_files_route);

router.get('/file/:id/retrieve', fileController.get_file_information);

// TODO : Get all files by user ID - requires pulling user from local session

module.exports = router;
