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

// there is a faster way to add mutliple files to playlists, 
// but in that case it would be impossible to check if all files are reviewed
async function addFileToPlaylist(playlistId, fileIDs) {
    console.log(fileIDs);
    for (let i = 0; i < fileIDs.length; i++) {
        console.log(mongoose.Types.ObjectId(fileIDs[i]));
        try {
            const file = await AudioFile.findOne({ 'fileId': fileIDs[i], 'reviewed': true });
            if (!file) {
                throw new StatusError(null, 'Can\'t add non-existing file to the playlist', 404);
            }
        }
        catch (err) {
            throw new StatusError(err.message, 'Error checking file availability', 500);
        }
    }
    let updatedPlaylist;
    try {
        updatedPlaylist = await Playlist.findOneAndUpdate({
            '_id': playlistId
        }, { $addToSet: { 'files': { $each: fileIDs } } },
            { upsert: true, useFindAndModify: false, new: true });
        console.log(updatedPlaylist);
        console.log("Number of files: " + updatedPlaylist.files.length);

        return updatedPlaylist;
    }
    catch (err) {
        throw new StatusError(err.message, 'Error adding file to the playlist', 500);
    }
    // prints number of files in the playlist

};


module.exports = {
    createEmptyPlaylist,
    addFileToPlaylist,
}