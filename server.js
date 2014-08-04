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

require('./app/routes.js')(router, passport);

// register the API Routes
app.use('/', router);

// ==============
//      Go!
// ==============
app.listen(port);
console.log("Magic happens on port " + port);