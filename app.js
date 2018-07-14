var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campgrounds'),
    Comment = require('./models/comments'),
    seedDB = require('./seeds');

// Connecting MONGOOSE
mongoose.connect('mongodb://localhost/yelp_camp');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.render('homepage');
    console.log('Homepage requested');
});

seedDB();

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

// app.get('/campgrounds/:id/comments/new',function(req,res){
//     Campground.findById(req.params.id,function(err,foundCampground){
//         if(err)
//         console.log(err);
//         res.render('new',{campground:foundCampground});
//     });
// });

// app.post('campgrounds/:id',function(req,res){
//     Campground.create(req.body.comment,function(err,comment){
//         if(err)
//         console.log(err);

//     })
// })

app.listen(3000,function(){
    console.log('YelpCamp server has started');
});