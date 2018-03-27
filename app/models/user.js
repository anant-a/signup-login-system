const mongoose =require('mongoose');
const bcrypt = require ('bcrypt-nodejs');


//defining user schema

let userSchema = mongoose.Schema({

    local         : {
        email     : String,
        password  : String,
    }
})

//methods=================================

//generate hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//validity of password
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}

//creating a model for user 

module.exports =mongoose.model('User' , userSchema);
