'use strict';

// Form and button
const form = document.querySelector('#uploadForm');
const subBtn = document.querySelector('#uploadButton');

const selected_file = {};
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

const keyReq = (e, user_id) => {
  e.preventDefault();
  const query = window.location.origin + '/' + user_id + '/keys/single_key';
  const request = new XMLHttpRequest();
  request.open("GET", query, true);
  request.send();

  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      on_recieve_key(request.response);
    }
  }
};

const on_recieve_key = async function(json) {
    let public_key = JSON.parse(json).public_key;

    //console.log(public_key);
    console.log("public key recieved")


    if (!selected_file.data instanceof ArrayBuffer) {
        console.log("malformed data");
    } else {
        let options = {
            data: new Uint8Array(selected_file.data),
            publicKeys: openpgp.key.readArmored(public_key).keys,
        };
        let result = await openpgp.encrypt(options).then(function(ciphertext) {
            let encrypted = ciphertext.data;
            return encrypted;
        });
    }

};

// Functions
function readerReady(e){
  console.log(e.target.result);
  selected_file.data= e.target.result;

  // TODO: call fn() for GPG code with e.target.result
}

// TODO: set up GPG CODE as fn()
