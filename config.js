require('dotenv').config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY
};