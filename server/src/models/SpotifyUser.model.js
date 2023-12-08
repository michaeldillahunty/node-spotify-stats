const mongoose = require('mongoose');
const { Schema } = mongoose;

const SpotifyUserSchema = new Schema({
    id: String,
    display_name: String,
    name: String,
    href: String,
    images: [{ url: String, height: Number, width: Number }],
    product: String,
    email: String,
    external_urls: { spotify: String },
    lists: []
    
}, { timestamps: true });

const SpotifyUser = mongoose.model('spotify-user', SpotifyUserSchema);
module.exports = SpotifyUser;