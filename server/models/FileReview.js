const mongoose = require('mongoose');
const AudioFile = require('./AudioFile');
const User = require('./User');

const FileReviewSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Types.ObjectId,
        ref: 'AudioFile',
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
}, { strictQuery: false });


module.exports = mongoose.model("FileReview", FileReviewSchema, 'fileReviews');