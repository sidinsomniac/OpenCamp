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
    methodOverride = require('method-override'),
    flash = require('connect-flash');
    // seedDB = require('./seeds');

var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost/yelp_camp');

// Initialize app
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Use the routes
app.use('/',indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);

app.listen(3000,function(){
    console.log('YelpCamp server has started');
});