var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');

router.get('/',function(req,res){
    res.render('homepage');
    console.log('Homepage requested');
});

// *****************Auth Routes*****************
// Register Functionality
router.get('/register',function(req,res){
    res.render('register');
    console.log('Sign Up page requested');
});

router.post('/register',function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        else{
            passport.authenticate('local')(req,res,function(){
                console.log(`New User ${user.username} Signed up`);
                res.redirect('/campgrounds');
            });
        }
    });
});

// Log In Functionality
router.get('/login',function(req,res){
    res.render('login');
    console.log('Log In page requested');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req,res){
        console.log('Logged In');
});

// Logout Functionality
router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/campgrounds');
    console.log('Logged Out');
});

// Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;