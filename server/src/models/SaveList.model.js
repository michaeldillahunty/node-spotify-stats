const mongoose = require('mongoose');

const GenericListSchema = new mongoose.Schema({
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

const GenericListModel = mongoose.model('list', GenericListSchema);
module.exports = GenericListModel;