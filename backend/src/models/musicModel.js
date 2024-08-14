const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    artist: {
        type: String,
        required: false
    },
    album: {
        type: String,
        required: false
    },
    genre: {
        type: String,
        required: false
    },
    bpm: {
        type: Number,
        required: true
    },
    energy: {
        type: Number,
        required: true
    },
    danceability: {
        type: Number,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    lyrics: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('Music', musicSchema);
