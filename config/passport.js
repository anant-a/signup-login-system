const LocalStrategy = require('passport-local').Strategy;

//loading up user model
const User = require('../app/models/user');

//exposing this function to app using module.exports
module.exports = function (passport) {
    //===========================================
    //passport session setup
    //============================================
    //required for persistent login sessions
    //ability to serialize and unserialize users out

    //serialize a user

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    })

    //desrialize a user

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(null, user);
        })
    })

    //LOCAL SIGNUP==================================================
    //using named strategy because we have one for login and another for signup

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true //allows us to pass the entire request as callback(dwivedi)
    },
        function (req, email, password, done) {

            process.nextTick(function () {
                //async
                //User.findOne won't fire unless data is sent back
                //checking if user already exists
                User.findOne({ 'local.email': email }, function (err, user) {
                    //if there are any errors, return the error
                    if (err) {
                        return done(err);
                    }

                    //checking if user already exists
                    if (user) {
                        return done(null, false, req.flash('signupMessages', 'That email is already taken'))
                    }
                    else {
                        //if no user exists, create a user
                        let newUser = new User();

                        //setting up local credentials
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        //save the user
                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        })
                    }

                })
            })

        }))

        //=======================================================
        //LOCAL LOGIN==================================
        //==========================================================
        // we are using named strategies sice we have one login and one signup.


        passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, 
        function(req, email, password, done){
            //find a user whose email is same as the forms email
            User.findOne({'local.email': email}, function(err, user){
              if(err){
                  return done(err)
              } 
              //if no user is found, return the message
              if(!user){
                  return done(null, false, req.flash('loginMessages', 'No user found'));//req.flash is the way to set flashdata using connect-flash
              }
              if(!user.validPassword(password)){
                  return done(null, false, req.flash('loginMessages', 'Oops! Wrong password.'))
              }
              else{
                  return done(null, user);
              }
            })
        }))
}