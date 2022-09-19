const mongoose = require('mongoose');

const metadata = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    reviewed: {
        type: String,
        required: true
    },
    songName: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { _id: false });


const AudioFileSchema = new mongoose.Schema({
    length: {
        type: Number,
        required: true
    },
    chunkSize: {
        type: Number,
        required: true
    },
    uploadDate: {
        type: Date,
        required: true
    },
    filename: {
        type: String,
        required: true
        //unique: true // this doesn't prevent GridFS from uploading files with the same name...
    },
    contentType: {
        type: String,
        required: true
    },
    metadata: {
        type: metadata,
        required: true
    }
});

module.exports = mongoose.model("AudioFile", AudioFileSchema, 'audioFiles.files');