module.exports = function(app, passport){
    // HOME PAGE(with login links)

    app.get('/', function(req,res){
        res.render('index.ejs');
    })

    //LOGIN=======================
    app.get('/login', function(req,res){
        //render the page and pass in any flash data if it exists
        res.render('login.ejs',{message: req.flash('loginMessages')});
    });


    //process the login form
    app.post('/login', passport.authenticate('local-login',{
        successRedirect :'/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));


    //SIGNUP=============================================
    app.get('/signup', function(req,res){
        res.render('signup.ejs',{message: req.flash('signupMessages')});
        
    })


    //process the signup form

    app.post('/signup', passport.authenticate('local-signup',{
        sucessRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash : true
    }))

    //PROFILE SECTION=====================================

    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    app.get('/profile', isLoggedIn, function(req,res){
        res.render('profile.ejs',{
            user: req.user //getting user out of session
        })
    })


    //LOGOUT=============================
    app.get('/logout',function(req,res){
        req.logout();
        res.redirect('/');
    })
}

//middleware for checking if user is logged in
function isLoggedIn(req, res, next){

    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/');
    }
}