const playlistService = require('../services/playlists.service');
const { StatusError } = require('../utils/helper.util');
const helperUtil = require('../utils/helper.util');

async function createEmptyPlaylist(req, res, next) {
    try {
        res.status(201).send(await playlistService.createEmptyPlaylist(req.user, req.body));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.log(err);
        next(new StatusError(err.message, 'Error creating playlist', 500));
    }
};

async function addFileToPlaylist(req, res, next) {
    try {
        res.status(201).send(await playlistService.addFileToPlaylist(req.body.playlistId, req.body.fileIDs));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.log(err);
        next(new StatusError(err.message, 'Error adding file to playlist', 500));
    }
};

async function updatePlaylistVisibility(req, res, next) {
    try {
        res.status(201).send(await playlistService.updatePlaylistVisibility(req.body.playListId, req.body.visibility));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.log(err);
        next(new StatusError(err.message, 'Error updating playlist visibility'));
    }
}

async function getPlaylistById(req, res, next) {
    try {
        res.status(200).send(await playlistService.getPlaylistById(req.user, req.body.playlistId));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.log(err);
        next(new StatusError(err.message, 'Error fetching playlist', 500));
    }
}

async function getPlaylists(req, res, next) {
    try {
        res.status(200).send(await playlistService.getPlaylists(req.user, req.body));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.log(err);
        next(new StatusError(err.message, 'Error fetching playlists', 500));
    }
}

async function deletePlaylist(req, res, next) {
    try {
        res.status(200).send(await playlistService.deletePlaylist(req.user, req.body.playlistId));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.log(err);
        next(new StatusError(err.message, 'Error deleting playlist', 500));
    }
}

module.exports = {
    createEmptyPlaylist,
    addFileToPlaylist,
    updatePlaylistVisibility,
    getPlaylistById,
    getPlaylists,
    deletePlaylist,
}