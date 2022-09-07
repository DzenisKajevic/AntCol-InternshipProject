const playlistService = require('../services/playlists.service');
const { StatusError } = require('../utils/helper.util');
const helperUtil = require('../utils/helper.util');

async function createEmptyPlaylist(req, res, next) {
    try {
        res.status(201).send(await playlistService.createEmptyPlaylist(req.user, req.body));
    }
    catch (err) {
        console.log(err);
        next(new StatusError(err.message, 'Error creating playlist', 500));
    }
};

async function addFileToPlaylist(req, res, next) {
    try {
        res.status(201).send(await playlistService.addFileToPlaylist(req.body.playlistId, req.body.fileId));
    }
    catch (err) {
        console.log(err);
        next(new StatusError(err.message, 'Error adding file to playlist', 500));
    }
};

module.exports = {
    createEmptyPlaylist,
    addFileToPlaylist,
}