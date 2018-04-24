const file_model = require('../models/file_model'),
      multer = require('multer'),
      upload = multer(),
      path = require('path'),
      mime = require('mime'),
      fs = require('fs'),
      key_model = require('../models/key_model').key_model,
      key_controller = require('./keys-controller').key_controller,
      openpgp = require('openpgp');

let file_controller = {
  upload_file: (req, res) => {
      
        const file_extension = req.body.file_extension;
        const file_name = req.body.file_name;
        const enc_file_data = req.body.enc_file_data;
        const uploaded_file = {
            file_id: null,
            file_name: file_name,
            file_ext: file_extension,
            file_data: enc_file_data,
            user_id: req.user.schema.id.value,
            file_key: null
        }
        
        
        let newFileModel = new file_model();

        let returned_id = newFileModel.set(uploaded_file.file_id, uploaded_file.file_name, uploaded_file.file_ext, uploaded_file.file_data, uploaded_file.user_id, uploaded_file.file_key);
        
        if (!returned_id){
            req.flash('error_message', {message: "Something went horribly, horribly wrong. Please don't do that again."});
            res.redirect('/');
        }else{
            req.flash('success_message', "File uploaded successfully");
            res.redirect(`/${req.user.schema.id.value}/files/file/${returned_id}`);
        }
  },

  file_route_get : (req,res) => {
      let keyModelInstance = new key_model();
      keyModelInstance.schema.load(1);
      
      const key_controller_instance = key_controller;
      let key_arr = key_controller_instance.get_all_keys_by_user_id(req.user.schema.id.value);
      res.render('files/index', {PUBLIC_KEY: keyModelInstance.schema.return_properties_array().public_key, PRIVATE_KEY: keyModelInstance.schema.return_properties_array().private_key, all_keys: key_arr});
  },

  file_id_get : (req,res) => {
      const fileId = req.params.id;
      const file_model_instance = new file_model();

      if (fileId){
          file_model_instance.schema.load(fileId);
          if (file_model_instance.schema.data){
                const schema_data = {
                    file_name: file_model_instance.schema.name.value,
                    file_ext: file_model_instance.schema.extension.value,
                    file_data: file_model_instance.schema.data.value,
                    file_id: file_model_instance.schema.id.value,
                    uploader_id: file_model_instance.schema.user.value
                }
                res.render('files/file_info', {file_info: schema_data});

          }else{
              req.flash('error_message', {message: "Something went wrong, please try again."});
              res.render('/files/');
          }
      }else{
          req.flash('error_message', {message: "Unable to obtain file ID"});
          res.render('/files/');
      }
  },

  file_transfer_get : (req,res) => {
      const fileId = req.params.id;
      if (fileId){
          res.render('files/transfer', {fileId: fileId});
      }else{
          res.render('files/transfer');
      }
  },

  get_file_properties: function(file_id){
      let fm = new file_model();
      fm.load_by_id(file_id);
      let fmp = fm.get_file_properties();
  },


  get_file_binary: function(file_id){
    //TODO: get file data with ID [DATA]
  },

  update_file_data: function(file_id, file_data){

  },

  delete_file: function(file_id){
    //TODO: delete file functionality
  },

  get_files_by_user: function(user_id){
      let f = new file_model();
      let results = f.schema.load_multiple(user_id, 'user');
      return results;
  },

  get_files_route: function(req, res) {
      let files = fileController.get_files_by_user(req.user.schema.id.value);
      res.render('files/all_files', {files: files});
  },

  list_all_files_ADMIN: function(){

  },

  file_download: (req,res) => {
    let file_data = req.body.file_data,
        file_ext = req.body.file_ext,
        file_name = req.body.file_name;  

    let mime_type = (file_data.file_ext == "txt" ? "text/plain" : "application/octet-stream");

    res.setHeader('Content-disposition', 'attachment; filename=' + file_name);
    res.setHeader('Content-type', mime_type);

    var contents = new Buffer(file_data);

    return res.send(200, contents);
  },
    
  file_download_raw: (req,res) => {
    let file_data = req.body.file_data,
        file_ext = req.body.file_ext,
        file_name = req.body.file_name,
        file_id = req.body.file_id;  

    let mime_type = (file_data.file_ext == "txt" ? "text/plain" : "application/octet-stream");
      
    //TODO: After key-file association: 
      /*
      * 1) Find key associated with this file ID
      * 2) use key to decrypt file
      * 3) pass back decrypted file
      */

    res.setHeader('Content-disposition', 'attachment; filename=' + file_name);
    res.setHeader('Content-type', mime_type);

    var contents = new Buffer(file_data);

    return res.send(200, contents);
  },
    
  get_file_id_by_data: (data) => {
      const file_model_instance = new file_model();
      file_model_instance.schema.load(data, "data");
      return file_model_instance.schema.id.value;
  }
}


module.exports.file_controller = file_controller;
