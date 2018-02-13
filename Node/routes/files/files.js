const express = require('express'),
      router = express.Router()
      fileController = require('../../controllers/file-controller');

router.get('/', fileController.file_route_get);

router.get('/file/:id', fileController.file_id_get);

router.get('/file/transfer/:id', fileController.file_transfer_get);
    
module.exports = router;