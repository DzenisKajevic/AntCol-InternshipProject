const mongoose = require('mongoose');
const AudioFile = require('./AudioFile');
const User = require('./User');

const FileReviewSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Types.ObjectId,
        ref: 'AudioFile',
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
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    songName: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadDate: {
        type: Date,
        required: true
    },
    reviewStatus: {
        type: String,
        required: true
    },
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    adminName: {
        type: String,
    },
    reviewTerminationDate: {
        type: Date,
    },
    description: {
        type: String
    }
});


module.exports = mongoose.model("FileReview", FileReviewSchema, 'fileReviews');