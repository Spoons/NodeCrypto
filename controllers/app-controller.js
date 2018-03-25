const app_controller = {
    index_get: (req,res) => {
         res.render('index');
    },

    error_render: (req,res) => {
        
        res.render('404');
    }
}

module.exports.app_controller = app_controller;