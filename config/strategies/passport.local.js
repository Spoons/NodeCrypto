const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;



module.exports = (user_model, user_controller) => {
    passport.use(new LocalStrategy(
        function(username, password, done){
            let user_login = new user_model();
            user_login = user_controller.load_by_username(username);

            // Check if user was found, will be null for username if not.
            if (!user_login.username.value){
                return done(null, false, {message: 'Unable to find account associated.'});
            }else{
                // User found, compare passwords
                // Put in user model?
                //console.log("INFO RECEIVED:\n\tUsername:\t"+username+"\n\tPassword:\t"+password);
                user_controller.password_compare(password, user_login.password.value, function(err, isMatch){
                    if (err){
                        console.log("Error encountered: " + err);
                    }else{
                        if (isMatch){
                            return done(null, user_login);
                        }else{
                            return done(null, false, {message: 'Password does not match.'});
                        }
                    }
                });
            }
        }
    ));
}
