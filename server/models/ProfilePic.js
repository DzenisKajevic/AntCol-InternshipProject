const mongoose = require('mongoose');

const metadata = new mongoose.Schema({
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { _id: false });


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
    metadata: {
        type: metadata,
        required: true
    }
});

module.exports = mongoose.model("ProfilePic", ProfilePicSchema, 'profilePics.files');