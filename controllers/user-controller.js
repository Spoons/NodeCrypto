const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      bcrypt = require('bcryptjs'),
      user_model = require('../models/user_model');

module.exports.user_controller = {
    login: (req,res) => {
        
    },
    get_login: (req,res) => {
        res.render('users/login');
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
