const Playlist = require('../models/Playlist');
const AudioFile = require('../models/AudioFile');
const { StatusError } = require('../utils/helper.util');
const mongoose = require('mongoose');
const User = require('../models/User');

async function createEmptyPlaylist(user, reqBody) {
    const emptyArray = [];
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
async function addFilesToPlaylist(user, playlistId, fileIDs) {
    for (let i = 0; i < fileIDs.length; i++) {
        const file = await AudioFile.findOne({ '_id': fileIDs[i], 'reviewed': true });
        console.log(file);
        if (!file) {
            throw new StatusError(null, 'Can\'t add non-existing file to the playlist', 404);
        }
    }
    let updatedPlaylist;
    updatedPlaylist = await Playlist.findOneAndUpdate({
        '_id': playlistId,
        'userId': user.userId,
    }, { $addToSet: { 'files': { $each: fileIDs } } },
        { upsert: false, useFindAndModify: false, new: true }); // upsert creates a new document if nothing is found

    if (!updatedPlaylist) throw new StatusError(null, 'Can\'t add files to a non-existing playlist', 404);
    console.log(updatedPlaylist);
    // prints number of files in the updated playlist
    console.log("Number of files: " + updatedPlaylist.files.length);

    return updatedPlaylist;
};


async function removeFilesFromPlaylist(user, playlistId, fileIDs) {
    let updatedPlaylist;
    updatedPlaylist = await Playlist.findOneAndUpdate({
        '_id': playlistId,
        'userId': user.userId
    }, { $pull: { 'files': { $in: fileIDs } } },
        { upsert: false, useFindAndModify: false, new: true });

    if (!updatedPlaylist) throw new StatusError(null, 'Can\'t remove files from a non-existing playlist', 404);
    console.log(updatedPlaylist);
    // prints number of files in the updated playlist
    console.log("Number of files: " + updatedPlaylist.files.length);

    return updatedPlaylist;
}

async function updatePlaylistVisibility(user, playlistId, visibility) {
    let playlist = await Playlist.findOneAndUpdate({ '_id': playlistId, 'userId': user.userId }, { 'visibility': visibility }, { new: true });
    if (!playlist) {
        throw new StatusError(null, 'Playlist not found', 404);
    }
    console.log(playlist);
    return playlist;
};

// this function and updateVisibility could be merged into a single function, but that's not the priority currently.
async function updatePlaylistName(user, playlistId, playlistName) {
    let playlist = await Playlist.findOneAndUpdate({ '_id': playlistId, 'userId': user.userId }, { 'playlistName': playlistName }, { new: true });
    if (!playlist) {
        throw new StatusError(null, 'Playlist not found', 404);
    }
    console.log(playlist);
    return playlist;
};


async function getPlaylistById(user, playlistId) {
    const playlist = await Playlist.findOne({ '_id': playlistId }).populate('files').populate('sharedWith', 'username _id');
    if (!playlist) throw new StatusError("Playlist not found", 404);
    else if (user.userId === playlist.userId.toString()) {
        playlist.userId = undefined;
        delete playlist.userId;
        console.log(playlist);
        return playlist;
    }
    else if ((playlist.visibility === "public") || (playlist.sharedWith.includes(user.userId))
        || (user.role === "Admin")) {
        playlist.userId = undefined;
        playlist.sharedWith = undefined;
        delete playlist.userId;
        delete playlist.sharedWith;
        console.log(playlist);
        return playlist;
    }
    throw new StatusError(null, "Forbidden: No permissions to access that playlist", 403);
};

async function getPlaylists(user, reqQuery) {
    page = parseInt(reqQuery.page) || 1;
    pageSize = parseInt(reqQuery.pageSize) || 10;


    // if we're looking for our own playlists
    if (!reqQuery.userId || reqQuery.userId === user.userId) {
        let playlists = await Playlist.find({ 'userId': user.userId })
            .skip((page - 1) * pageSize).limit(pageSize);
        return playlists;
    }

    // if we're looking for someone else's playlists
    else {
        if (user.role === "Admin") {
            let playlists = await Playlist.find({ 'userId': reqQuery.userId })
                .skip((page - 1) * pageSize).limit(pageSize);
            return playlists;
        }
        // commented line below is for checking if a playlist is shared with the user
        //{ userId: user.userId }, $or: [{ visibility: "public" }, { sharedWith: {$in: [user.userId]} }];
        let playlists = await Playlist.find({ 'userId': reqQuery.userId, $or: [{ 'visibility': 'public' }, { sharedWith: { $in: [user.userId] } }] })
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
    usersToShareWith = usersToShareWith.filter(user => User.findOne(user));
    if (!usersToShareWith.length) throw new StatusError(null, 'Could not find any users with those IDs', 404);
    const playlist = await Playlist.findOneAndUpdate({ 'userId': user.userId, '_id': playlistId },
        { $addToSet: { 'sharedWith': { $each: usersToShareWith } } }, { useFindAndModify: false, new: true })
        .populate('sharedWith', 'username _id');
    if (!playlist) throw new StatusError(null, 'Playlist not found');
    console.log(playlist);
    return playlist;
}

async function revokePlaylistShare(user, playlistId, usersToRevokeSharing) {
    //pulling with $each won't work, $in will though
    const playlist = await Playlist.findOneAndUpdate({ 'userId': user.userId, '_id': playlistId },
        { $pull: { 'sharedWith': { $in: usersToRevokeSharing } } }, { useFindAndModify: false, new: true })
        .populate('sharedWith', 'username _id');
    console.log(playlist);
    return playlist;
}



module.exports = {
    createEmptyPlaylist,
    addFilesToPlaylist,
    removeFilesFromPlaylist,
    updatePlaylistVisibility,
    updatePlaylistName,
    getPlaylistById,
    getPlaylists,
    deletePlaylist,
    sharePlaylist,
    revokePlaylistShare,
}