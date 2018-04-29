'use strict';

// For use later
// action="/<%= user.schema.id.value %>/files/file/<%= file_info.file_id %>/download/raw" method="POST"

const form_info = document.querySelector('#download_and_unencrypt_form');

const unencrypt = function(e, user_id){
  e.preventDefault();
  // let passphrase = prompt("Please enter the passphrase for your key");
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
    xhrKey.onloadend = function(){
      console.log(JSON.parse(xhrKey.response));
    }

  }
}
