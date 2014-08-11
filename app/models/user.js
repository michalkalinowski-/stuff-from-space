var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define schema for user model
var userSchema = mongoose.Schema ({
    local : {
        email : String,
        password : String
    }
});

// generate hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); // not sure if salt is long enough
};

// check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create model and export it
module.exports = mongoose.model('User', userSchema);




