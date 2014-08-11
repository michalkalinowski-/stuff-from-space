module.exports = function(router, passport) {

    // index
    router.route('/')
        .get(function(req, res) {
            res.render('index.ejs');
        });

    // login
    router.route('/login')
        .get(function(req, res) {
            res.render('login.ejs', {message : req.flash("loginMessage")});
        });
    // do all passport processing stuff here

    // signup
    router.route('/signup')
        .get(function(req, res) {
            res.render('signup.ejs', {message : req.flash("signupMessage")});
        })
        .post(passport.authenticate('local-signup', {
            successRedirect : '/profile',
            failureRedirect : '/signup',
            failureFlash : true
        }));

    // ---  profile  ---
    // P R O T E C T E D
    // have to be logged in to access
    router.route('/profile')
        .all(function(req, res, next) {
            if(req.isAuthenticated()) {
                return next();
            }
            // if not logged in redirect to home
            res.redirect('/');
        })
        .get(function(req, res) {
            res.render('profile.ejs', { user : req.user });
        });

    // logout
    router.route('logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/');
        });
};