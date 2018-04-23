const key_model = require('../models/key_model').key_model,
      file_controller = require('./user-controller').file_controller,
      keys_controller = require('./user-controller').keys_controller,
      openPGP = require('openpgp');

let key_controller = {
    get_all_keys: function(req,res){
        const user_id = req.user.schema.id.value,
              key_model_instance = new key_model();

        const all_keys = key_model_instance.schema.load_multiple(user_id, 'user');
        res.render('users/keys/all_keys', {KEYS: all_keys});
    },
    
    get_all_keys_by_user_id: function(user_id){
        const key_model_instance = new key_model();

        const all_keys = key_model_instance.schema.load_multiple(user_id, 'user');
        console.log(all_keys);
        return all_keys;
    },

    get_single_key: function(req,res){
        const user_id = req.user.schema.id.value,
              key_model_instance = new key_model();
        
        if (req.params.pref_key != "none"){
            
            key_model_instance.schema.load(req.params.pref_key, "name", "string");
            
            key_model_instance.to_string();
        }else{
            key_model_instance.schema.load(user_id, 'user');
        }
        
        let jsonObj = {
          public_key: key_model_instance.schema.public_key || "",
          private_key: key_model_instance.schema.public_key || ""
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(jsonObj));
    },
    
    store_keys: function(req,res){
        const user_id = req.user.schema.id.value,
              key_name = req.body.key_name;
        
        const key_model_instance = new key_model();
        console.log("Storing key with name " + key_name + " in database.");
        key_model_instance.set(null, key_name, req.body.private_key, req.body.public_key, -1, user_id);
        res.end();
    },
    
    update_file_key: (req,res) => {
//        const key_pair = req.body.link_data.key_pair,
//              file_data = req.body.link_data.file_data,
//              key_model_instance = new key_model();
//        
//        const key_model_instance = new key_model(),
//              file_controller_instance = new file_controller();
//        
//        key_model_instance.schema.load(key_pair.private_key, 'private_key');
//        const file_id = file_controller_instance.get_file_id_by_data(file_data);
//        
//        
    }
};

module.exports.key_controller = key_controller;
