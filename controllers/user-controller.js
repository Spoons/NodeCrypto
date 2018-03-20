const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      bcrypt = require('bcryptjs'),
      user_model = require('../models/user_model');

let user_controller = {
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
                        this.user_controller.create_user(user_register_info.user_name, hash);
                        console.log("New user added to DB:");
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

    },
    load_by_username: function(username) {
        let load_user = new user_model();
        let user = load_user.schema.load(username, 'username');
        return load_user.schema;
    },
    load_by_id: function(id) {
        let load_user = new user_model();
        let user = load_user.schema.load(id);
        return user.schema;
    },
    delete_by_id: function(id) {
        return;
    },
    create_user: function(username, hash, files = {}) {
      let create_user_instance = new user_model();
      create_user_instance.set(null, username, hash, {});
    },
    password_compare: function(password, comparePassword, callback){
        let password_match = bcrypt.compare(password, comparePassword, function(err, isMatch){
            callback(err, isMatch);
        });
    }
}

module.exports.user_controller = user_controller;

/*
    //TODO:
        - Create user with blank object ({}) for files parameter?
        - Set user ID based on next available DB ID?
        - Add firstname/lastname to DB?
*/
