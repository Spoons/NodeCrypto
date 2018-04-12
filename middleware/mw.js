const middleware = {
    isAuthenticated: (req,res,next) => {
        if (req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/users/login');
        }
    },
    
    isAuthenticatedByID: (req,res,next) => {
        if (req.user){
            console.log(req.params.userID + ":" + req.user.schema.id.value);
            if (req.params.userID == req.user.schema.id.value){
                return next();
            }else{
                req.flash('error', 'You do not have sufficient privileges to view this page.');
                res.redirect('/');
            }   
        }else{
            req.flash('error_message', {message: 'Please log in before viewing this page'});
            res.redirect('/users/login');
        }
    }
}

module.exports = middleware;