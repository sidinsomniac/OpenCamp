var mongoose = require('mongoose'),
    Campground = require('./models/campgrounds'),
    Comment = require('./models/comments');
    data = [
                {
                    name : "Creek Row", 
                    image : "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
                    description: "This is in the midst of Peru. Temperature is nominal and water is crystal clear. No signal reception."
                },
                {
                    name : "Granite Hill", 
                    image : "https://images.pexels.com/photos/730426/pexels-photo-730426.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
                    description: "This is a huge granite hill. No bathrooms. No water. Just beautiful granite."
                },
                {
                    name : "Coleman Ridge",
                    image : "https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
                    description: "Greenery amongst snow white snow. A combination of Greenland and Iceland, except you know which is which."
                },
                {
                    name : "Canyon Abyss", 
                    image : "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
                    description: "It's like home. Except it is not. Experience the comfort of home and nothing more after you've paid a hefty sum to us. Very practical."
                },    
                {
                    name : "Leviathan Heights", 
                    image : "https://images.pexels.com/photos/965153/pexels-photo-965153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                    description: "The name is ironical since it is the opposite of height. It's the deepest trench in America, and oh, it doesn't exist in case you were wondering"
                }
            ];

function seedDB(){
    Campground.remove({},function(err){
        if(err)
        console.log(err);
        console.log('Removed campgrounds');
        Comment.remove({},function(err){
            if(err)
            console.log(err);
            console.log('Removed comments');
            data.forEach(function(campground){
                Campground.create(campground,function(err,newCampground){
                    if(err)
                    console.log(err);
                    console.log('Added new campground '+newCampground.name);
                    Comment.create(
                        {
                            text:'This is a default comment',
                            author: 'god_mode_on'
                        },
                        function(err,newComment){
                            if(err)
                            console.log(err);
                            newCampground.comments.push(newComment);
                            newCampground.save();
                            console.log('New comment made by '+ newComment.author);
                        }
                    );
                });
            });
        });
    });
}

module.exports = seedDB;