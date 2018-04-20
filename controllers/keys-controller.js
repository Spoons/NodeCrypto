const key_model = require('../models/key_model').key_model,
      user_controller = require('./user-controller').user_controller,
      openPGP = require('openpgp');

let key_controller = {
    get_all_keys: function(req,res){
        const user_id = req.user.schema.id.value,
              key_model_instance = new key_model();
        
        const all_keys = key_model_instance.schema.load_multiple(user_id, 'user');
        res.render('users/keys/all_keys', {KEYS: all_keys});
    },
    
    generate_key: function(req,res){
        console.log("Hit the function!");
        const passphrase = req.params.phrase;
        const options = {
            data: new Uint8Array([0x01, 0x01, 0x01]), // input as Uint8Array (or String)
            passwords: [passphrase],              // multiple passwords possible
            armor: false                              // don't ASCII armor (for Uint8Array output)
        };
        let encrypted = '';

        openpgp.encrypt(options).then(function(ciphertext) {
            encrypted = ciphertext.message.packets.write(); // get raw encrypted packets as Uint8Array
        });
        
        console.log(encrypted);
    }
};

module.exports.key_controller = key_controller;