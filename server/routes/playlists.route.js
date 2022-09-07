const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const playlistsController = require('../controllers/playlists.controller');

router.post('/createEmptyPlaylist', playlistsController.createEmptyPlaylist);

router.post('/addFileToPlaylist', playlistsController.addFileToPlaylist);

module.exports = router;