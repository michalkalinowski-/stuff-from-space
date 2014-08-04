// ==============
//     Setup
// ==============

// Import Packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

// configure db
mongoose.connect(configDB.URL);

// DB Models
 var Bear = require('./app/models/bear');

// authentication
// require('./config/passport')(passport); //pass passport for configuration

// configure app
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

// required for passport
app.use(session({secret: 'aaaaaaaaaa'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // for flash messages stored in session

// define port - move to config ?
var port = process.env.PORT || 8083;

// ==============
//     Routes
// ==============

var router = express.Router();

// middleware
router.use(function(req, res, next) {
    console.log("OMG! I'm on fire");
    next();
});

// Bear routes
router.route('/bears')
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
router.route('/bears/:bear_id')
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

// register the API Routes
app.use('/api', router);

// ==============
//      Go!
// ==============
app.listen(port);
console.log("Magic happens on port " + port);