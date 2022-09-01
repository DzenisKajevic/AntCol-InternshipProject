const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const audioFileController = require('../controllers/audioFile.controller');
const middleware = require('../middleware/middleware');


// deletes a specific file
router.delete('/deleteFile', audioFileController.deleteFile);

// uploads a file
router.post('/uploadFile', middleware.uploadMiddleware, audioFileController.uploadFile);

// returns a specific file, ready for playback
router.get('/getFile/:id', audioFileController.getFile);

// returns information on a file
router.get('/getFileInfo/:id', audioFileController.getFileInfo);

// lists info on all available files
router.get('/getAllFiles', audioFileController.getAllFiles);

// lists info on all files from a certain genre
router.get('/getFilesByGenre', audioFileController.getFilesByGenre);

// lists info on all files from a certain author
router.get('/getFilesByAuthor', audioFileController.getFilesByAuthor);

module.exports = router;