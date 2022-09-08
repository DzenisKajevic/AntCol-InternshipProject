const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const playlistsController = require('../controllers/playlists.controller');

router.post('/createEmptyPlaylist', playlistsController.createEmptyPlaylist);

router.post('/addFilesToPlaylist', playlistsController.addFilesToPlaylist);

router.delete('/removeFileFromPlaylist', playlistsController.removeFileFromPlaylist);

router.put('/updatePlaylistVisibility', playlistsController.updatePlaylistVisibility);

router.get('/getPlaylistById', playlistsController.getPlaylistById);

router.get('/getPlaylists', playlistsController.getPlaylists);

router.delete('/deletePlaylist', playlistsController.deletePlaylist);

router.put('/sharePlaylist', playlistsController.sharePlaylist);

router.put('/revokePlaylistShare', playlistsController.revokePlaylistShare);

module.exports = router;