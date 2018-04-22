'use strict';

const form = document.querySelector('#uploadForm');

document.addEventListener("DOMContentLoaded", function() {
  form.addEventListener('change', function(event) {
    const fileData = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onloadend = readerReady;
    fileReader.readAsArrayBuffer(fileData);
  });
});

function readerReady(e){
  console.log(e);
  console.log(e.target.result);

  // TODO: call fn() for GPG code with e.target.result
}

// TODO: set up GPG CODE as fn()
