var express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds');

// Index Route to view all campground lists
router.get('/',function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log('There was an error');
        }
        else{
            res.render('campgrounds/index',{campgrounds:campgrounds});
        }
    });
    console.log('Index page requested');
});

// Create Route to add new campgrounds to the database
router.post('/', isLoggedIn, function(req,res){
    req.body.newground.author = {
        id: req.user._id,
        username: req.user.username
    };
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
router.get('/newground', isLoggedIn, function(req,res){
    res.render('campgrounds/newground');
    console.log('New campground form requested');
});

// Show Route to show more info on a single campground
router.get('/:id',function(req,res){
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

router.get('/:id/edit',campgroundAuthorize,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        res.render('campgrounds/edit',{campground:campground});
        console.log('Edit page requested');
    });
});

router.put('/:id/edit',campgroundAuthorize,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.updatedCampground,function(err,updateCampground){
        if(err)
            res.redirect('/campgrounds');
        else{
            res.redirect('/campgrounds/'+req.params.id);
            console.log('Campground Updated');
        }
    });
});

router.delete('/:id',campgroundAuthorize,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect('/campgrounds');
        else{
            res.redirect('/campgrounds');
            console.log('Campground removed');
        }
    });
});

// Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// Authorize campground function
function campgroundAuthorize(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,campground){
            if(err)
            res.redirect('back');
            else{
                if(campground.author.id.equals(req.user._id)){
                    next();
                    console.log('Edit page requested');
                }
                else{
                    res.redirect('back');
                }
            }
        });
    }
    else{
        res.redirect('back');
    }
}

module.exports = router;