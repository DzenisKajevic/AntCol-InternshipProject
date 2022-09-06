const mongoose = require('mongoose');

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
        type: String,
        //unique: true // this doesn't prevent GridFS from uploading files with the same name...
    },
    contentType: {
        type: String
    },
    author: {
        type: String
    },
    genre: {
        type: String
    },
    reviewed: {
        type: Boolean
    },
    songName: {
        type: String
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model("AudioFile", AudioFileSchema, 'audioFiles.files');