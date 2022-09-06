const mongoose = require('mongoose');

const FileReviewSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Types.ObjectId,
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
        type: String,
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
    underReviewBy: {
        type: mongoose.Types.ObjectId,
        //required: true
    },
    reviewTerminationDate: {
        type: Date,
        //required: true
    }
});


module.exports = mongoose.model("FileReview", FileReviewSchema, 'fileReviews');