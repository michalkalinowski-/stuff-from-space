var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {
    // passport session setup
    //-----------------------

    // serialize user for session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // passport strategies
    // ------------

    // signup
    passport.use('local-signup', new LocalStrategy({
        // override username with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // pass back entire request to callback
    },
    function(req, email, password, done) {

        // asynhronus : won't fire until data is sent back
        process.nextTick(function() {
            User.findOne({ 'local.email' : email}, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    // if there is already user with this email
                    return done(null, false, req.flash('signupMessage', 'That email is already taken'));
                } else {
                    // create new user
                    var newUser = new User();

                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

};
