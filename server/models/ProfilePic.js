const mongoose = require('mongoose');

const ProfilePicSchema = new mongoose.Schema({
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
    },
    contentType: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model("ProfilePic", ProfilePicSchema, 'profilePictures.files');