var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// Connecting MONGOOSE
mongoose.connect('mongodb://localhost/yelp_camp');

// Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

// Modelling
var Campground = mongoose.model('Campground',campgroundSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.render('homepage');
    console.log('Homepage requested');
});


// Campground.create(
//     [
//         {
//             name : "Creek Row", 
//             image : "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
//             description: "This is in the midst of Peru. Temperature is nominal and water is crystal clear. No signal reception."
//         },
//         {
//             name : "Granite Hill", 
//             image : "https://images.pexels.com/photos/730426/pexels-photo-730426.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
//             description: "This is a huge granite hill. No bathrooms. No water. Just beautiful granite."
//         },
//         {
//             name : "Coleman Ridge",
//             image : "https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
//             description: "Greenery amongst snow white snow. A combination of Greenland and Iceland, except you know which is which."
//         },
//         {
//             name : "Canyon Abyss", 
//             image : "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
//             description: "It's like home. Except it is not. Experience the comfort of home and nothing more after you've paid a hefty sum to us. Very practical."
//         },    
//         {
//             name : "Leviathan Heights", 
//             image : "https://images.pexels.com/photos/965153/pexels-photo-965153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//             description: "The name is ironical since it is the opposite of height. It's the deepest trench in America, and oh, it doesn't exist in case you were wondering"
//         }
//     ],
//     function(err,campground){
//         if(err)
//         console.log(err);
//         else{
//             console.log(campground);
//         }
//     }
// )


// Index Route to view all campground lists
app.get('/campgrounds',function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log('There was an error');
        }
        else{
            res.render('index',{campgrounds:campgrounds});
        }
    })
    console.log('Index page requested');
});

// Create Route to add new campgrounds to the database
app.post('/campgrounds',function(req,res){
    var newgroundname = {
        name:req.body.name,
        image:req.body.image,
        description:req.body.description
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

// New Route to add new campgrounds to the form
app.get('/campgrounds/newground',function(req,res){
    res.render('newground');
    console.log('New campground form requested');
});

// Show Route to show more info on a single campground
app.get('/campgrounds/:id', function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render('show',{campground:foundCampground});
        }
    });
    console.log(`Requested ${req.params.id} page`);
})

app.listen(3000,function(){
    console.log('YelpCamp server has started');
});