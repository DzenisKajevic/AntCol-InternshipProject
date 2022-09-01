const mongoose = require('mongoose');
const validator = require('validator');
const generalConfig = require('../configs/general.config');

const AudioFileSchema = new mongoose.Schema({
    length: {
        type: Number
    },
    chunkSize: {
        type: Number
    },
    uploadDate: {
        type: Date
    },
    filename: {
        type: String
    },
    contentType: {
        type: String
    },
    author: {
        type: String
    },
    genre: {
        type: String
    }
});

module.exports = mongoose.model("AudioFile", AudioFileSchema, 'audioFiles.files');