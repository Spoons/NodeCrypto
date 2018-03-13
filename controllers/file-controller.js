const file_model = require('../models/file_model'),
      multer = require('multer'),
      upload = multer();

exports.file_route_get = (req,res) => {
    res.render('files/index');
}

exports.file_id_get = (req,res) => {
    const fileId = req.params.id;
    if (fileId){
        res.render('files/file', {fileId: fileId});
    }else{
        res.render('files/file');
    }
}

exports.file_transfer_get = (req,res) => {
    const fileId = req.params.id;
    if (fileId){
        res.render('files/transfer', {fileId: fileId});
    }else{
        res.render('files/transfer');
    }
}

exports.file_controller = {
  upload_file: (req, res) => {
        const uploaded_file = {
            file_name: req.files.uploadedFile.name,
            file_data: req.files.uploadedFile.data
        }
        console.log(uploaded_file);
        let newFileModel = new file_model();
        newFileModel.set(1, uploaded_file.file_name, uploaded_file.file_data.toString('hex'), null, null);
        res.redirect('/files/');
  },

  get_file_properties: function(file_id){
    //TODO: get file data with ID [JSON]
  },

  get_file_binary: function(file_id){
    //TODO: get file data with ID [DATA]
  },

  update_file_data: function(file_id, file_data){
    //TODO: update file with ID with data
  },

  delete_file: function(file_id){
    //TODO: delete file functionality
  },

  list_files_by_user: function(user_id){
    //TODO: get all files by given user ID
  },

  list_all_files_ADMIN: function(){

  }
}
