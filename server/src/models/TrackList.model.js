const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    external_urls: { spotify: String },
    href: String,
    id: String,
    name: String,
    type: String,
    uri: String
});

const ImageSchema = new Schema({
    height: Number,
    url: String,
    width: Number
});

const AlbumSchema = new Schema({
    album_type: String,
    artists: [ArtistSchema],
    available_markets: [String],
    external_urls: { spotify: String },
    href: String,
    id: String,
    images: [ImageSchema],
    name: String,
    release_date: String,
    release_date_precision: String,
    total_tracks: Number,
    type: String,
    uri: String
});

const TrackSchema = new Schema({
    album: AlbumSchema,
    artists: [ArtistSchema],
    available_markets: [String],
    disc_number: Number,
    duration_ms: Number,
    explicit: Boolean,
    external_ids: { isrc: String },
    external_urls: { spotify: String },
    href: String,
    id: String,
    is_local: Boolean,
    name: String,
    popularity: Number,
    preview_url: String,
    track_number: Number,
    type: String,
    uri: String
});

const UserTopTracksSchema = new Schema({
    user: { type: String, required: true },
    items: [TrackSchema],
    total: Number,
    limit: Number,
    offset: Number,
    href: String,
    next: String,
    previous: String
});

const UserTopTracks = mongoose.model('top-track-lists', UserTopTracksSchema);

module.exports = UserTopTracks;