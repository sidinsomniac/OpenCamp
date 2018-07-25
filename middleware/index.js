var Campground = require('../models/campgrounds');
var Comment = require('../models/comments');
var middlewareObj = {};

middlewareObj.campgroundAuthorize = function(req,res,next){
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
};

middlewareObj.commentAuthorize = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err)
            res.redirect('back');
            else{
                if(foundComment.author.id.equals(req.user.id)){
                    next();                    
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
};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

module.exports = middlewareObj;