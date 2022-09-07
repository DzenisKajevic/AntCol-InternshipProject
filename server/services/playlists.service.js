const Playlist = require('../models/Playlist');
const AudioFile = require('../models/AudioFile');
const { StatusError } = require('../utils/helper.util');
const mongoose = require('mongoose');

async function createEmptyPlaylist(user, reqBody) {
    const emptyArray = [];
    console.log(reqBody);
    console.log(typeof (emptyArray));
    const input = {
        'visibility': reqBody.visibility || 'private',
        'numberOfFiles': 0,
        'files': emptyArray,
        'playlistName': reqBody.playlistName,
        'userId': user.userId,
        'username': user.username
    };
    const playlist = await Playlist.create(input);
    return playlist;
};

async function addFileToPlaylist(playlistId, fileId) {
    console.log(fileId);
    console.log(mongoose.Types.ObjectId(fileId));
    const objId = mongoose.Types.ObjectId(fileId);
    console.log(fileId, objId);
    const file = await AudioFile.findOne({ 'fileId': fileId, 'reviewed': true });
    if (file) {
        console.log("starting!!!!", objId);
        console.log(mongoose.Types.ObjectId(fileId));
        let updatedPlaylist = await Playlist.findOneAndUpdate({
            '_id': playlistId
        }, { $addToSet: { 'files': objId } },
            { upsert: true, useFindAndModify: false, new: true });

        // prints number of files in the playlist
        console.log("Number of files: " + updatedPlaylist.files.length);
        console.log(updatedPlaylist);
        return updatedPlaylist;
    }
    throw new StatusError(null, 'Can\'t add non-existing file to the playlist', 500);
};

module.exports = {
    createEmptyPlaylist,
    addFileToPlaylist,
}