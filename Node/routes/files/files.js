const express = require('express'),
      router = express.Router();

router.get('/', (req,res) => {
    res.render('files/index');
});

router.get('/file/:id', (req,res) => {
    const fileId = req.params.id;
    if (fileId){
        res.render('files/file', {fileId: fileId});    
    }else{
        res.render('files/file');
    }
});

router.get('/file/transfer/:id', (req,res) => {
    const fileId = req.params.id;
    if (fileId){
        res.render('files/transfer', {fileId: fileId});    
    }else{
        res.render('files/transfer');
    }
});
    
module.exports = router;