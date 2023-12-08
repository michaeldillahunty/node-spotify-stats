const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    user: { type: String, required: true },
    type: { type: String, required: true },
    items: [{
            name: String,
            popularity: Number,
            external_urls: { spotify: String },
            images: [{ url: String, height: Number, width: Number }],
    }],
}, { timestamps: true });

const ListModel = mongoose.model('list', ListSchema);
module.exports = ListModel;