const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;


exports.user_id_get = (req,res) => {
    res.render('users/user');
}

exports.user_signup_get = (req,res) => {
  res.render('users/signup');
}

exports.user_signup_get = (req,res) => {
  passport.use('local-signup'), new LocalStrategy({
    usernameField: 'email'
  });
}
