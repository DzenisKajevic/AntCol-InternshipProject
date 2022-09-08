const playlistService = require('../services/playlists.service');
const { StatusError } = require('../utils/helper.util');
const helperUtil = require('../utils/helper.util');

async function createEmptyPlaylist(req, res, next) {
    try {
        res.status(201).send(await playlistService.createEmptyPlaylist(req.user, req.body));
    }
    catch (err) {
        if (err.message.startsWith("E11000 duplicate key error")) {
            console.log(err);
            next(new StatusError(err.message, `A playlist with that name already exists`, 500));
        }
        else if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        else {
            console.log(err);
            next(new StatusError(err.message, `Error creating playlist`, 500));
        }
    }
};

async function addFilesToPlaylist(req, res, next) {
    try {
        res.status(201).send(await playlistService.addFilesToPlaylist(req.body.playlistId, req.body.fileIDs));
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

async function removeFileFromPlaylist(req, res, next) {
    try {
        res.status(201).send(await playlistService.removeFileFromPlaylist(req.body.playlistId, req.body.fileIDs));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.log(err);
        next(new StatusError(err.message, 'Error removing file from playlist', 500));
    }
};

async function updatePlaylistVisibility(req, res, next) {
    try {
        res.status(201).send(await playlistService.updatePlaylistVisibility(req.body.playlistId, req.body.visibility));
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

async function sharePlaylist(req, res, next) {
    try {
        res.status(200).send(await playlistService.sharePlaylist(req.user, req.body.playlistId, req.body.usersToShareWith));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.log(err);
        next(new StatusError(err.message, 'Error sharing playlist', 500));
    }
}

async function revokePlaylistShare(req, res, next) {
    try {
        res.status(200).send(await playlistService.revokePlaylistShare(req.user, req.body.playlistId, req.body.usersToShareWith));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.log(err);
        next(new StatusError(err.message, 'Error revoking playlist sharing privileges', 500));
    }
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