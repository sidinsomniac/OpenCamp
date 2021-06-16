const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const { MONGODB_URI } = require("../config");

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const authors = ["613b372fdc48d645fc153011", "613b41d32a6b1713f4aca84e", "613b5d0beb1766193048fb54"];

const sample = array => array[Math.floor(Math.random() * array.length)];

const randomize = (sampleLength) => {
    return Math.floor(Math.random() * sampleLength);
};


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const price = Math.floor(Math.random() * 20) + 10;
        const campgroundCity = cities[randomize(406)];
        const author = authors[randomize(3)];
        const camp = new Campground({
            author,
            location: `${campgroundCity.city}, ${campgroundCity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [campgroundCity.longitude, campgroundCity.latitude]
            }
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});