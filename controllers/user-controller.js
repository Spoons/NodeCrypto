const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

module.exports.user_controller = {
    login: (req,res) => {
        
    },
    get_login: (req,res) => {
        res.render('users/login');
    },
    register: (req,res) => {
        const user_register_info = {
              first_name: req.body.firstname,
              last_name:  req.body.lastname,
              user_name: req.body.username,
              password: req.body.password,
              password_confirmation: req.body.password_conf
        }
        console.log(user_register_info);
        res.redirect('/');
    },
    get_register: (req,res) => {
        res.render('users/register');
    },
    user_get: (req,res) => {
        
    }
}