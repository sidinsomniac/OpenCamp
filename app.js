var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// Connecting MONGOOSE
mongoose.connect('mongodb://localhost/yelp_camp');

// Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

// Modelling
var Campground = mongoose.model('Campground',campgroundSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.render('homepage');
    console.log('Homepage requested');
});

app.get('/campgrounds',function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log('There was an error');
        }
        else{
            res.render('campgrounds',{campgrounds:campgrounds});
        }
    })
    console.log('Campground page requested');
});

app.post('/campgrounds',function(req,res){
    var newgroundname = {
        name:req.body.name,
        image:req.body.image
    };
    Campground.create(newgroundname, function(err,campground){
        if(err){
            console.log('There was an error');
        }
        else{
            res.redirect('/campgrounds');            
        }
    });
});

app.get('/campgrounds/newground',function(req,res){
    res.render('newground');
    console.log('New campground form requested');
});

app.listen(3000,function(){
    console.log('YelpCamp server has started');
});