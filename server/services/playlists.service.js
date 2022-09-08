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
            const file = await AudioFile.findOne({ '_id': fileIDs[i], 'reviewed': true });
            console.log(file);
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
        // prints number of files in the updated playlist
        console.log("Number of files: " + updatedPlaylist.files.length);

        return updatedPlaylist;
    }
    catch (err) {
        throw new StatusError(err.message, 'Error adding file to the playlist', 500);
    }
};

async function updatePlaylistVisibility(playlistId, visibility) {
    try {
        let playlist = await Playlist.findOneAndUpdate({ '_id': playlistId }, { 'visibility': visibility });

        if (!playlist) {
            throw new StatusError(null, 'Playlist not found', 404);
        }
        console.log(playlist);
    }
    catch (err) {
        throw new StatusError(err.message, 'Error updating playlist visibility', 500);
    }
};

async function getPlaylistById(user, playlistId) {
    try {
        const playlist = await Playlist.findOne({ '_id': playlistId }).populate('files');
        console.log(playlist);
        if (!playlist) throw new StatusError("Playlist not found", 404);
        if ((user.userId === playlist.userId.toString()) || (playlist.visibility === "public")
            || (user.role === "Admin")) return playlist;
        throw new StatusError(null, "Forbidden: No permissions to access that playlist", 403);
    }
    catch (err) {
        throw new StatusError(err.message, "Error fetching playlist", 500);
    }
};

async function getPlaylists(user, reqBody) {
    try {
        page = parseInt(reqBody.page) || 1;
        pageSize = parseInt(reqBody.pageSize) || 10;


        // if we're looking for our own playlists
        if (!reqBody.userId || reqBody.userId === user.userId) {
            let playlists = await Playlist.find({ 'userId': user.userId }).select('-userId').skip((page - 1) * pageSize).limit(pageSize);
            return playlists;
        }

        // if we're looking for someone else's playlists
        else {
            if (user.role === "Admin") {
                let playlists = await Playlist.find({ 'userId': reqBody.userId }).select('-userId').skip((page - 1) * pageSize).limit(pageSize);
                return playlists;
            }
            // commented line below is for checking if a playlist is shared with the user
            //{ userId: user.userId }, $or: [{ visibility: "public" }, { sharedWith: {$in: [user.userId]} }];
            let playlists = await Playlist.find({ 'userId': reqBody.userId, 'visibility': 'public' }).select('-userId').skip((page - 1) * pageSize).limit(pageSize);
            return playlists;
        }

    }
    catch (err) {
        console.log(err);
        throw new StatusError(null, "Error fetching playlists", 500);
    }
}

async function deletePlaylist(user, playlistId) {
    const playlist = await Playlist.deleteOne({ 'userId': user.userId, '_id': playlistId });
    if (!playlist.deletedCount) throw new StatusError(null, 'Error: Nothing was deleted', 500);
    return "Successfully deleted the playlist";
};

module.exports = {
    createEmptyPlaylist,
    addFileToPlaylist,
    updatePlaylistVisibility,
    getPlaylistById,
    getPlaylists,
    deletePlaylist,
}