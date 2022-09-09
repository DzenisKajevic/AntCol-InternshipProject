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

    // delete can only remove attributes if they're undefined
    playlist['userId'] = undefined;
    delete playlist['userId'];
    console.log(playlist);
    return playlist;
};

// there is a faster way to add mutliple files to playlists, 
// but in that case it would be impossible to check if all files are reviewed
async function addFilesToPlaylist(playlistId, fileIDs) {
    console.log(fileIDs);
    for (let i = 0; i < fileIDs.length; i++) {
        console.log(mongoose.Types.ObjectId(fileIDs[i]));
        const file = await AudioFile.findOne({ '_id': fileIDs[i], 'reviewed': true });
        console.log(file);
        if (!file) {
            throw new StatusError(null, 'Can\'t add non-existing file to the playlist', 404);
        }
    }
    let updatedPlaylist;
    updatedPlaylist = await Playlist.findOneAndUpdate({
        '_id': playlistId
    }, { $addToSet: { 'files': { $each: fileIDs } } },
        { upsert: false, useFindAndModify: false, new: true }).select('-userId'); // upsert creates a new document if nothing is found

    if (!updatedPlaylist) throw new StatusError(null, 'Can\'t add files to a non-existing playlist', 404);
    console.log(updatedPlaylist);
    // prints number of files in the updated playlist
    console.log("Number of files: " + updatedPlaylist.files.length);

    return updatedPlaylist;
};


async function removeFileFromPlaylist(playlistId, fileIDs) {
    console.log(fileIDs);
    let updatedPlaylist;
    updatedPlaylist = await Playlist.findOneAndUpdate({
        '_id': playlistId
    }, { $pull: { 'files': { $in: fileIDs } } },
        { upsert: false, useFindAndModify: false, new: true }).select('-userId');

    if (!updatedPlaylist) throw new StatusError(null, 'Can\'t remove files from a non-existing playlist', 404);
    console.log(updatedPlaylist);
    // prints number of files in the updated playlist
    console.log("Number of files: " + updatedPlaylist.files.length);

    return updatedPlaylist;
}

async function updatePlaylistVisibility(playlistId, visibility) {
    let playlist = await Playlist.findOneAndUpdate({ '_id': playlistId }, { 'visibility': visibility }).select('-userId');
    if (!playlist) {
        throw new StatusError(null, 'Playlist not found', 404);
    }
    console.log(playlist);
    return playlist;
};

async function getPlaylistById(user, playlistId) {
    const playlist = await Playlist.findOne({ '_id': playlistId }).populate('files');
    if (!playlist) throw new StatusError("Playlist not found", 404);
    if ((user.userId === playlist.userId.toString()) || (playlist.visibility === "public") || (playlist.sharedWith.includes(user.userId))
        || (user.role === "Admin")) {
        playlist.userId = undefined;
        delete playlist.userId;
        console.log(playlist);
        return playlist;
    }
    throw new StatusError(null, "Forbidden: No permissions to access that playlist", 403);
};

async function getPlaylists(user, reqBody) {
    page = parseInt(reqBody.page) || 1;
    pageSize = parseInt(reqBody.pageSize) || 10;


    // if we're looking for our own playlists
    if (!reqBody.userId || reqBody.userId === user.userId) {
        let playlists = await Playlist.find({ 'userId': user.userId }).select('-userId')
            .skip((page - 1) * pageSize).limit(pageSize);
        return playlists;
    }

    // if we're looking for someone else's playlists
    else {
        if (user.role === "Admin") {
            let playlists = await Playlist.find({ 'userId': reqBody.userId }).select('-userId')
                .skip((page - 1) * pageSize).limit(pageSize);
            return playlists;
        }
        // commented line below is for checking if a playlist is shared with the user
        //{ userId: user.userId }, $or: [{ visibility: "public" }, { sharedWith: {$in: [user.userId]} }];
        let playlists = await Playlist.find({ 'userId': reqBody.userId, $or: [{ 'visibility': 'public' }, { sharedWith: { $in: [user.userId] } }] }).select('-userId')
            .skip((page - 1) * pageSize).limit(pageSize);
        return playlists;
    }
}

async function deletePlaylist(user, playlistId) {
    const playlist = await Playlist.deleteOne({ 'userId': user.userId, '_id': playlistId }).select('-userId');
    if (!playlist.deletedCount) throw new StatusError(null, 'Error: Nothing was deleted', 500);
    return "Successfully deleted the playlist";
};

async function sharePlaylist(user, playlistId, usersToShareWith) {
    const playlist = await Playlist.findOneAndUpdate({ 'userId': user.userId, '_id': playlistId },
        { $addToSet: { 'sharedWith': { $each: usersToShareWith } } }, { useFindAndModify: false, new: true }).select('-userId');
    console.log(playlist);
    return playlist;
}

async function revokePlaylistShare(user, playlistId, usersToRevokeSharing) {
    //pulling with $each won't work, $in will though
    const playlist = await Playlist.findOneAndUpdate({ 'userId': user.userId, '_id': playlistId },
        { $pull: { 'sharedWith': { $in: usersToRevokeSharing } } }, { useFindAndModify: false, new: true }).select('-userId');;
    console.log(playlist);
    return playlist;
}



module.exports = {
    createEmptyPlaylist,
    addFilesToPlaylist,
    removeFileFromPlaylist,
    updatePlaylistVisibility,
    getPlaylistById,
    getPlaylists,
    deletePlaylist,
    sharePlaylist,
    revokePlaylistShare,
}