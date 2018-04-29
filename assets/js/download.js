'use strict';

// For use later
// action="/<%= user.schema.id.value %>/files/file/<%= file_info.file_id %>/download/raw" method="POST"

const form_info = document.querySelector('#download_and_unencrypt_form');

const unencrypt = function(e, user_id){
  e.preventDefault();
  let xhr = new XMLHttpRequest(),
      file_id = form_info.childNodes[7].value,
      query = `${window.location.origin}/${user_id}/files/file/${file_id}/retrieve`;

  xhr.open('GET', query);
  xhr.send();

  xhr.onloadend = function(){
    let retrieved_data = JSON.parse(xhr.response),
        key_id = retrieved_data.key_id;

    let xhrKey = new XMLHttpRequest();
    query = `${window.location.origin}/${user_id}/keys/key/${key_id}/retrieve`;
    xhrKey.open("GET", query);
    xhrKey.send();
    xhrKey.onloadend = async function(){
      let key_info = JSON.parse(xhrKey.response);
      let passphrase = prompt("Please enter the passphrase for this key");
      console.log(key_info.private_key);
      let privKeyObj = openpgp.key.readArmored(key_info.private_key).keys[0];
      await privKeyObj.decrypt(passphrase);
      console.log("Got past decrypt");

      let options = {
        message: openpgp.message.readArmored(retrieved_data.file_data),
        privateKeys: [privKeyObj]
      };

      let decrypted = await openpgp.decrypt(options).then(function(plaintext) {
        return plaintext.data;
      });

      console.log(decrypted);
    }
  }
}
