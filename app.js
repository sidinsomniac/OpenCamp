var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    expressSession = require('express-session'),
    Campground = require('./models/campgrounds'),
    Comment = require('./models/comments'),
    User = require('./models/users'),
    seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
seedDB();

// Passport Configuration
app.use(expressSession({
    secret: "A quick brown fox jumped over the lazy dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.get('/',function(req,res){
    res.render('homepage');
    console.log('Homepage requested');
});


// Index Route to view all campground lists
app.get('/campgrounds',function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log('There was an error');
        }
        else{
            res.render('campgrounds/index',{campgrounds:campgrounds});
        }
    })
    console.log('Index page requested');
});

// Create Route to add new campgrounds to the database
app.post('/campgrounds',function(req,res){
    Campground.create(req.body.newground, function(err,campground){
        if(err){
            console.log('There was an error');
        }
        else{
            res.redirect('/campgrounds');            
        }
    });
});

// New Route to add new campgrounds to the form
app.get('/campgrounds/newground',function(req,res){
    res.render('campgrounds/newground');
    console.log('New campground form requested');
});

// Show Route to show more info on a single campground
app.get('/campgrounds/:id', function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render('campgrounds/show',{campground:foundCampground});
        }
    });
    console.log(`Requested ${req.params.id} page`);
});

// *************Comments*************

app.get('/campgrounds/:id/comments/new',isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        console.log(err);
        else{
            res.render('comments/new',{campground:campground});
        }
    });
});

app.post('/campgrounds/:id/comments',isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds/'+campground._id);
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    console.log('Added new comment');
                    res.redirect('/campgrounds/'+campground._id)
                }
            });
        }
    });
});

// *****************Auth Routes*****************
// Register Functionality
app.get('/register',function(req,res){
    res.render('register');
    console.log('Sign Up page requested');
});

app.post('/register',function(req,res){
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
app.get('/login',function(req,res){
    res.render('login');
    console.log('Log In page requested');
});

app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req,res){
        console.log('Logged In');
});

// Logout Functionality
app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/campgrounds');
    console.log('Logged Out');
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(3000,function(){
    console.log('YelpCamp server has started');
});