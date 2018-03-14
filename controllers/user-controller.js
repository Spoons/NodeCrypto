const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      bcrypt = require('bcryptjs'),
      user_model = require('../models/user_model');

passport.use(new LocalStrategy(
    function(username, password, done){
        const user_login = new user_model();
        user_login.schema.load(username, 'username', 'String');
        
        // Check if user was found, will be null for username if not.
        if (!user_login.schema.username.value){
            return done(null, false, {message: 'Unable to find account associated.'});
        }else{
            // User found, compare passwords
            // Put in user model?
            console.log("INFO RECEIVED:\n\tUsername:\t"+username+"\n\tPassword:\t"+password);
            let password_match = bcrypt.compare(password, user_login.schema.password.value, function(err, isMatch){
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

passport.serializeUser((user, done) => {
    done(null, user.schema.id.value);
});

passport.deserializeUser((id, done) => {
    const new_user_model = new user_model();
    new_user_model.schema.load(id);
    let err = (new_user_model.schema.id.value == null) ? "User not found!" : null;
    done(err, new_user_model);
});

module.exports.user_controller = {
    login: (req,res) => {
        console.log(req.body);
        res.redirect('/');
    },
    get_login: (req,res) => {
        res.render('users/login');
    },
    logout: (req,res) => {
        console.log("Got here!");
        req.logout();
        req.flash('success_message', 'Successfully logged out.');
        res.redirect('/users/login');
    },
    register: (req,res) => {
        // Validation
        req.checkBody('firstname', 'First name required.').notEmpty();
        req.checkBody('lastname', 'Last name required.').notEmpty();
        req.checkBody('username', 'Username required.').notEmpty();
        req.checkBody('password', 'Password required.').notEmpty();
        req.checkBody('password_conf', 'Passwords must match.').equals(req.body.password);
        
        const errors = req.validationErrors();
        
        if (errors){
            // Rerender page, pass errors
            console.log(errors);
            res.render('users/register', {
                errors: errors
            });
        }else{
            const user_register_info = {
                  first_name: req.body.firstname,
                  last_name:  req.body.lastname,
                  user_name: req.body.username,
                  password: req.body.password,
                  password_confirmation: req.body.password_conf
            }
            console.log("Received user:\n\t" + user_register_info.first_name);
            
            // Generate hashed PW
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user_register_info.password, salt, (err, hash) => {
                    if (err){
                        console.log(err);
                    }else{
                        // Add user to DB
                        const user_instance = new user_model();
                        user_instance.set(1, user_register_info.user_name, hash,  {});
                        console.log("New user added to DB:");
                        user_instance.print();
                        req.flash('success_message', "Successfully registered.");
                        res.redirect('/');
                    }
                });
            });
        }
    },
    get_register: (req,res) => {
        res.render('users/register');
    },
    user_get: (req,res) => {
        
    }
}

/*
    //TODO: 
        - Create user with blank object ({}) for files parameter?
        - Set user ID based on next available DB ID?
        - Add firstname/lastname to DB?
*/
