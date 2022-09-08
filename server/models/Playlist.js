const mongoose = require('mongoose');
const AudioFile = require('./AudioFile');
const User = require('./User');

const FileArraySchema = new mongoose.Schema(
    { _id: mongoose.Types.ObjectId },);

const PlaylistSchema = new mongoose.Schema({
    visibility: {
        type: String,
        required: true
    },
    files: [ // length can be taken with returnFromRequest.files.length
        {
            type: mongoose.Types.ObjectId,
            ref: 'AudioFile',
            required: true
        }
    ],
    playlistName: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    sharedWith: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }]
});

PlaylistSchema.index({ playlistName: 1, userId: 1 }, { unique: true }); // schema level

module.exports = mongoose.model("Playlist", PlaylistSchema, 'playlists');