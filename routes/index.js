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
            req.flash('error',err.message);
            res.redirect('/register');
        }
        else{
            passport.authenticate('local')(req,res,function(){
                console.log(`New User ${user.username} Signed up`);
                req.flash('success','Welcome, '+ user.username +"!");
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
    req.flash('success','You logged out');
    res.redirect('/campgrounds');
    console.log('Logged Out');
});

module.exports = router;