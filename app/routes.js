module.exports = function(router, passport) {

    // DB Models
    var Bear = require('./models/bear');

    // middleware
    // router.use(function(req, res, next) {
    //     console.log("OMG! I'm on fire");
    //     next();
    // });

    // Login stuff

    // index
    router.route('/')
        .get(function(req, res) {
            res.send('index.ejs');
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
        });

    // ---  profile  ---
    // P R O T E C T E D
    // have to be logged in to access
    router.route('/profile')
        .all(function(req, res, next) {
            if(req.isAuthenticarted()) {
                return next();
            }
            // if not logged in redirect to home
            res.redirect('/');
        })
        .get(function(req, res) {
            res.render('profile.ejs', { user : req.user });
        });
        
    // Bear routes
    router.route('/api/bears')
        .post(function(req, res) {
            var bear = new Bear();
            bear.name = req.body.name;

            // save and check for errors
            bear.save(function(err){
                if (err) {
                    req.send(err);
                }
                res.json({message : 'Bear created!'});
            });
        })
        .get(function(req, res) {
            Bear.find(function(err, bears){
                if (err) {
                    req.send(err);
                }
                res.json(bears);
            });
        });

    // Single Bear routes
    router.route('/api/bears/:bear_id')
        .get(function(req, res) {
            Bear.findById(req.params.bear_id, function(err, bear) {
                if (err) {
                    req.send(err);
                }
                res.json(bear);
            });
        })
        .put(function(req, res) {
            Bear.findById(req.params.bear_id, function(err, bear) {

                if (err) {
                    req.send(err);
                }

                bear.name = req.body.name;

                // save and check for errors
                bear.save(function(err){
                    if (err) {
                        req.send(err);
                    }
                    res.json({message : 'Bear updated!'});
                });
            });
        })
        .delete(function(req, res) {
            Bear.remove({
                _id: req.params.bear_id
            }, function(err, bear){
                if(err) {
                    req.send(err);
                }
                res.json({message : 'Bear Deleted!'});
            });
        });

}