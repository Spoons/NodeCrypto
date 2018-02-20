exports.file_route_get = (req,res) => {
    res.render('files/index');
}

exports.file_id_get = (req,res) => {
    const fileId = req.params.id;
    if (fileId){
        res.render('files/file', {fileId: fileId});    
    }else{
        res.render('files/file');
    }
}

exports.file_transfer_get = (req,res) => {
    const fileId = req.params.id;
    if (fileId){
        res.render('files/transfer', {fileId: fileId});    
    }else{
        res.render('files/transfer');
    }
}

let file_controller = {
}
