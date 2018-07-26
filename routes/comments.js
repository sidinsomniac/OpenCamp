var express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require('../models/campgrounds');
var Comment = require('../models/comments');
var middleware = require('../middleware');

router.get('/new',middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        console.log(err);
        else{
            res.render('comments/new',{campground:campground});
        }
    });
});

router.post('/',middleware.isLoggedIn,function(req,res){
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
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log('Added new comment');
                    req.flash('success','Added new comment');
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });
});

router.get('/:comment_id/edit',middleware.commentAuthorize,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err)
        res.redirect('back');
        else{
            res.render('comments/edit',{campground:req.params.id,foundComment:foundComment});
        }
    });
});

router.put('/:comment_id',middleware.commentAuthorize,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
        if(err)
        res.redirect('back');
        else{
            res.redirect('/campgrounds/'+req.params.id);
            console.log('Comment Updated');
        }
    });
});

router.delete('/:comment_id',middleware.commentAuthorize,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err)
        res.redirect('back');
        else{
            req.flash('success','Deleted comment!');
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

module.exports = router;