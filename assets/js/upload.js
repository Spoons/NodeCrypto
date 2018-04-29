'use strict';

// Page constants
const form = document.querySelector('#file_input'),
      base_url = window.location.origin + '/';

let optional_selected_key = document.querySelector('#preferred_key'),
    selected_file = {},
    generated_key = -1;

// DOM ready
document.addEventListener("DOMContentLoaded", function() {
  //  Form event listener, gather file data
  form.addEventListener('change', function(event) {
    selected_file = {};
    const fileData = event.target.files[0];
    console.log(fileData);
    let fileReader = new FileReader();
    fileReader.onloadend = readerReady;
    fileReader.readAsArrayBuffer(fileData);
  });
});

// Request key from server to encrypt
const keyReq = (e, user_id, preferred_key = "") => {
  e.preventDefault();

  // Prevent user from attempting to upload without selecting file data first.
  if (!selected_file.data || selected_file.data.length == 0){
      alert("Please select a file before attempting to upload.");
  }else{
    if (optional_selected_key){
          preferred_key = $('#preferred_key')[0].selectedOptions[0].value;
      }
      console.log("Processing request...");
      let xhr = new XMLHttpRequest();
      if (preferred_key == ""){
          let query = base_url + user_id + '/keys/single_key/none'
          xhr.open("GET", query, true);
          xhr.send();

           // Check ready state complete and OK status
          xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200){

                    const key_pair = JSON.parse(xhr.response);
                    if (key_pair.public_key != null){
                        encrypt(key_pair, user_id);
                    }else{
                        generate_user_key(e, user_id);
                    }
                }else{
                    alert("Unable to upload file at this time.");
                    window.location = base_url;
                }
            }
          }
      }else{
          let query = base_url + user_id + '/keys/single_key/' + preferred_key;
          const xhr = new XMLHttpRequest();
          xhr.open("GET", query, true);
          xhr.send();
               // Check ready state complete and OK status
              xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200){

                        const key_pair = JSON.parse(xhr.response);
                        if (key_pair.public_key != null){
                            encrypt(key_pair, user_id);
                        }else{
                            generate_user_key(e, user_id);
                        }
                    }else{
                        alert("Unable to upload file at this time.");
                        window.location = base_url;
                    }
                }
              }
      }
  }
};

// Encrypt function - pauses async to wait for encryption and uploads
const encrypt = async function(key_pair, user_id) {
    console.log("Encrypting...");
    let public_key = key_pair.public_key;
    //console.log(key_pair);
    if (!selected_file.data instanceof ArrayBuffer) {
        console.log("malformed data");
        alert('File could not be uploaded at this time.');
        window.location = base_url;
    } else {
        // ENCRYPTION
        let options = {
            data: new Uint8Array(selected_file.data),
            publicKeys: openpgp.key.readArmored(public_key).keys,
        };
        let result = await openpgp.encrypt(options).then(function(ciphertext) {
            let encrypted = ciphertext.data;
            return encrypted;
        });

        upload_file(result, user_id, key_pair);
    }
};

// Set file data when file reader finishes parsing data
function readerReady(e){
  selected_file.data= e.target.result;
}

// Builds form data and submits XMLHttpRequest POST to server
function upload_file(file_data, user_id, key_pair){
    console.log("Uploading...");
    let query = base_url + user_id + '/files/upload';

    // Gather information on file
    const file_input = form,
          file_name_escaped = file_input.value.replace(/\\/g, '/'),
          file_name = file_name_escaped.substr(file_name_escaped.lastIndexOf('/')+1, file_name_escaped.length) + ".gpg";

    let file_extension = '';

    if (file_name_escaped.lastIndexOf('.') <= 0){
      file_extension = file_name_escaped.substr(file_name_escaped.lastIndexOf('.'), file_name_escaped.length) + ".gpg";
    }else{
      file_extension = '.gpg';
    }

    // Create new FormData object
    const form_data = new FormData();
    form_data.append('file_name', file_name);
    form_data.append('file_extension', file_extension);
    form_data.append('enc_file_data', file_data);
    form_data.append('key_id', key_pair.key_id);
    //form_data.append('key_id', )

    // XMLHttpRequest POST form data
    const xhr = new XMLHttpRequest();
    xhr.open("POST", query);
    xhr.send(form_data);

    alert("File uploaded successfully.");
    window.location = base_url + user_id + '/files/files';
};

// Generates a new user key if none are available
const generate_user_key = async function(event_data, user_id){
    if (!selected_file.data || selected_file.data.length == 0){
      alert("Please select a file before attempting to upload.");
    }else{
        console.log("Generating user key pair...");
        event_data.preventDefault();
        // Prompt user for passphrase
        const passphrase = prompt("Please enter a passphrase to generate a key.");
        const key_name = prompt("Please enter a name for this key.");

        console.log("key passphrase: " + passphrase);

        // Set up options for keygen
        var options = {
            userIds: [{ id:user_id}],
            numBits: 2048,
            passphrase: passphrase
        };

        // Create new key pair
        let key_pair = await openpgp.generateKey(options).then(function(key) {
            const key_pair = {
                private_key: key.privateKeyArmored,
                public_key: key.publicKeyArmored,
                key_name: key_name
            }

            return key_pair;
        });

        store_user_keys(key_pair, user_id, event_data);
    }
}

// POSTs the key generated to the server to store with the user data
function store_user_keys(key_pair, user_id, event_data){
    console.log("Storing key pair...");
    const query = base_url + user_id + '/keys/store';

    // XMLHttpRequest POST user keys
    const xhr = new XMLHttpRequest();
    xhr.open("POST", query);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(key_pair));
    let keyResponse = {};
    xhr.onreadystatechange = function(){
      if (this.readyState == 4) {
          if (this.status == 200){
            keyResponse = JSON.parse(xhr.response);
            //console.log("key id at store_user_keys" + keyResponse);
            key_pair.key_id = keyResponse;
            // Encrypt with newely stored keys
            keyReq(event_data, user_id, key_pair.key_name);
        }
      }

    }

}
