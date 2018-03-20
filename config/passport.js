const passport = require('passport'),
      passport_local_strategy = require('./strategies/passport.local'),
      user_model = require('../models/user_model'),
      user_controller = require('../controllers/user-controller').user_controller;

module.exports = (app) => {
    // Application setup for passport
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Passport serialization and deserialization
    passport.serializeUser((user, done) => {
        done(null, user.id.value);
    });

    passport.deserializeUser((id, done) => {
        const new_user_model = new user_model();
        new_user_model.schema.load(id);
        let err = (new_user_model.schema.id.value == null) ? "User not found!" : null;
        done(err, new_user_model);
    });
    
    // Passport local strategy setup [session]
    passport_local_strategy(user_model, user_controller);
}