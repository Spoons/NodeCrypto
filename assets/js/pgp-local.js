function promptPGP(user_id){
    let phrase = prompt('Please enter a phrase to generate a key:');    
    const query = window.location.origin + '/' + user_id + '/keys/generate/' + escape(phrase);
    console.log(window.location);
    console.log('sending to ' + query);
    
    const sender = new XMLHttpRequest();
    sender.open("GET", query, true);
    sender.send();
}