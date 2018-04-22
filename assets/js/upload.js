'use strict';

// Form and button
const form = document.querySelector('#uploadForm');
const subBtn = document.querySelector('#uploadButton');

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
};

// Functions
function readerReady(e){
  console.log(e);
  console.log(e.target.result);

  // TODO: call fn() for GPG code with e.target.result
}

// TODO: set up GPG CODE as fn()
