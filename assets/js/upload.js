'use strict';

// Page constants
const form = document.querySelector('#uploadForm'),
      subBtn = document.querySelector('#uploadButton'),
      base_url = window.location.origin + '/',
      selected_file = {};

// DOM ready
document.addEventListener("DOMContentLoaded", function() {
  //  Form event listener, gather file data
  form.addEventListener('change', function(event) {
    const fileData = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onloadend = readerReady;
    fileReader.readAsArrayBuffer(fileData);
  });
});

// Request key from server to encrypt
const keyReq = (e, user_id) => {
  e.preventDefault();
  let query = base_url + user_id + '/keys/single_key'
  const xhr = new XMLHttpRequest();
  xhr.open("GET", query, true);
  xhr.send();

  // Check ready state complete and OK status
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      encrypt(xhr.response, user_id);
    }
  }
};

// Encrypt function - pauses async to wait for encryption and uploads
const encrypt = async function(json, user_id) {
    let public_key = JSON.parse(json).public_key;

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
        
        upload_file(result, user_id);
    }
};

// Set file data when file reader finishes parsing data
function readerReady(e){
  console.log(e.target.result);
  selected_file.data= e.target.result;
}

// Builds form data and submits XMLHttpRequest POST to server
function upload_file(file_data, user_id){
    const query = base_url + user_id + '/files/upload';
    
    // Gather information on file
    const file_input = form.childNodes[1],
          file_name_escaped = file_input.value.replace(/\\/g, '/'),
          file_name = file_name_escaped.substr(file_name_escaped.lastIndexOf('/')+1, file_name_escaped.length),
          file_extension = file_name_escaped.substr(file_name_escaped.lastIndexOf('.'), file_name_escaped.length);
    
    // Create new FormData object
    const form_data = new FormData();
    form_data.append('file_name', file_name);
    form_data.append('file_extension', file_extension);
    form_data.append('enc_file_data', file_data);
    
    // XMLHttpRequest POST form data
    const xhr = new XMLHttpRequest();
    xhr.open("POST", query);
    xhr.send(form_data);
    
    alert("File uploaded successfully.");
    window.location = base_url + user_id + '/files/files';
};
