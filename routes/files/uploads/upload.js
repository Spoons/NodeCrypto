const express = require('express'),
      router = express.Router(),
      multer = require('multer'),
      upload = multer(),
      file_model = require('../../../models/file_model');
 
// WIP: Uploads file and parses data, sends to model, will eventually send to controller
router.post('/', upload.single('uploadedFile'), function(req, res) {
//  console.log(req.files);
    const uploaded_file = {
        file_name: req.files.uploadedFile.name,
        file_data: req.files.uploadedFile.data
    }
    let newFileModel = new file_model();
    newFileModel.update(uploaded_file.file_name, uploaded_file.file_data.toString('hex'));    
    res.redirect('/files/');
});

module.exports = router;