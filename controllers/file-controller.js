const file_model = require('../models/file_model'),
      multer = require('multer'),
      upload = multer(),
      path = require('path'),
      mime = require('mime'),
      fs = require('fs');

let file_controller = {
  upload_file: (req, res) => {
        let in_file = req.files.uploadedFile;

        let file_extension = in_file.name.substr(in_file.name.lastIndexOf('.')+1, in_file.name.length);
        const uploaded_file = {
            file_id: 1,
            file_name: in_file.name,
            file_ext: file_extension,
            file_data: in_file.data,
            user_id: req.user.schema.id.value,
            file_key: null
        }

        console.log(uploaded_file);

        let newFileModel = new file_model();

//        let hexData = uploaded_file.file_data.toString('hex');
        let err = newFileModel.set(uploaded_file.file_id, uploaded_file.file_name, uploaded_file.file_ext, uploaded_file.file_data.toString('hex'), uploaded_file.user_id, uploaded_file.file_key);

        if (err){
            req.flash('error_message', {message: "Something went horribly, horribly wrong. Please don't do that again."});
            res.redirect('/');
        }else{
            req.flash('success_message', "File uploaded successfully");
            res.redirect(`/files/file/${uploaded_file.file_id}`);
        }

  },

  file_route_get : (req,res) => {
      res.render('files/index');
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
                res.render('files/file', {file_info: schema_data});

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
      console.log(fmp);
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

  get_files_by_user: function(user_id){
      let f = new file_model();
      console.log("running get_files_by_user....maybe it'll work??????");
      let results = f.schema.load_multiple(user_id, 'user');
      return results;
  },

  get_files_route: function(req, res) {
      let files = fileController.get_files_by_user(req.user.schema.id.value);
      console.log(files);
      res.redirect('/');
  },

  list_all_files_ADMIN: function(){

  },

  file_download: (req,res) => {
    let file_data = req.body.file_data;

    let mime_type = (file_data.file_ext == "txt" ? "text/plain" : "application/octet-stream");

    res.setHeader('Content-disposition', 'attachment; filename=' + req.body.file_name);
    res.setHeader('Content-type', mime_type);

    var contents = new Buffer(file_data, "hex");

    return res.send(200, contents);
  }
}


module.exports.file_controller = file_controller;
