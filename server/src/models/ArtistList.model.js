const mongoose = require('mongoose');

const TopArtistSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },

    items: [{
            name: String,
            popularity: Number,
            external_urls: { spotify: String },
            images: [{ url: String, height: Number, width: Number }],
    }],
}, { timestamps: true });

const UserTopArtists = mongoose.model('top-artists-list', TopArtistSchema);
module.exports = UserTopArtists;