var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var campgrounds = [{name:'Creek Row',image:'https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'},
{name:'Coleman Ridge',image:'https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'},
{name:'Granite Hill',image:'https://images.pexels.com/photos/730426/pexels-photo-730426.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'},
{name:'Canyon Abyss',image:'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'}];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.render('homepage');
    console.log('Homepage requested');
});

app.get('/campgrounds',function(req,res){
    res.render('campgrounds',{campgrounds:campgrounds});
    console.log('Campground page requested');
});

app.post('/campgrounds',function(req,res){
    var newgroundname = {name:req.body.name,image:req.body.image};
    campgrounds.push(newgroundname);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/newground',function(req,res){
    res.render('newground');
    console.log('New campgrounbdn form requested');
});

app.listen(3000,function(){
    console.log('YelpCamp server has started');
});