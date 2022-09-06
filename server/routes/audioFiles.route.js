const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const audioFileController = require('../controllers/audioFile.controller');
const middleware = require('../middleware/middleware');


// adds a file to the user's fav list
/** 
 * @swagger
 * /api/v1/audioFiles/addFileToFavourites:
 *   post:
 *     tags:
 *      - favourite files
 *     operationId: addFileToFavourites
 *     description: Add a file to your list of favourite files
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     requestBody:
 *      content:
 *       application/x-www-form-urlencoded:
 *        schema:
 *          type: object
 *          properties:
 *           fileId:
 *            example: 6311f239d67a5113d40edd4c
 *            description: ID of the requested file
 *            required: true
 *            type: string
 *     responses:
 *       201:
 *         description: File successfully added to favourites
 *       500:
 *         description: Selected file is already a favourite || Error adding file to favourites
 */
router.post('/addFileToFavourites', audioFileController.addFileToFavourites);

// uploads a file
/**
* @swagger
* /api/v1/audioFiles/uploadFile:
*   post:
*     tags:
*      - file uploads
*     description: Upload a file to the database
*     operationId: uploadFile
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     consumes:
*       - multipart/form-data
*     requestBody:
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               genre:
*                type: string
*                example: Something
*                required: true
*               author:
*                type: string
*                example: Someone
*                required: true
*               audioFile:
*                type: string
*                format: binary
*                required: true
*     responses:
*       201:
*         description: File successfully uploaded to the database
*         links:
*           GetFileById:
*             operationId: getFile
*             parameters:
*               fileId: '$response.body#/fileId'
*             description: >
*               The `fileId` value returned in the response can be used as
*               the `fileId` parameter in `GET /api/v1/audioFiles/addFileToFavourites`.
*           AddFileToFavourites:
*             operationId: addFileToFavourites
*             parameters:
*               fileId: '$response.body#/fileId'
*             description: >
*               The `fileId` value returned in the response can be used as
*               the `fileId` parameter in `POST /api/v1/audioFiles/addFileToFavourites`.
*           DeleteFileById:
*             operationId: deleteFile
*             parameters:
*               fileId: '$response.body#/fileId'
*             description: >
*               The `fileId` value returned in the response can be used as
*               the `fileId` parameter in `DELETE /api/v1/audioFiles/deleteFile`.
*       400:
*         description: Unsupported file type || File too large
*       401: 
*         description: Missing authorization
*       500:
*         description: File could not be uploaded
*/
router.post('/uploadFile', middleware.uploadMiddleware, audioFileController.uploadFile);

// returns a specific file, ready for playback
/** 
* @swagger
*  /api/v1/audioFiles/getFile/{fileId}: 
*   get: 
*    tags:
*      - file uploads
*    operationId: getFile
*    produces:
*       - audio/mp3
*       - audio/ogg
*       - audio/weba
*       - audio/aac
*       - audio/wav
*    security:
*       - bearerAuth: []
*    description: Use to fetch a single file with the specified id (Swagger only offers downloads, it can't play files)
*    parameters:
*       - in: path
*         name: fileId
*         schema:
*           type: string
*           example: 6311f239d67a5113d40edd4c
*    responses: 
*      200: 
*          description: Successful response
*      401: 
*          description: Missing authorization
*      404:
*          description: File not found
*      500:
*          description: Error fetching file info (invalid input?)
*/
router.get('/getFile/:id', audioFileController.getFile);

// returns information on a file
/** 
* @swagger
*  /api/v1/audioFiles/getFileInfo/{fileId}: 
*   get: 
*    tags:
*      - file uploads
*    operationId: getFileInfo
*    security:
*       - bearerAuth: []
*    description: Use to request information on a single file with the specified id
*    parameters:
*       - in: path
*         name: fileId
*         schema:
*           type: string
*           example: 6311f239d67a5113d40edd4c
*    responses: 
*      200: 
*          description: Successful response
*      401: 
*          description: Missing authorization
*      404:
*          description: File not found
*      500:
*          description: Error fetching file info (invalid input?)
*/
router.get('/getFileInfo/:id', audioFileController.getFileInfo);

// lists info on all available files
/** 
* @swagger
*  /api/v1/audioFiles/getAllFiles: 
*   get: 
*    tags:
*      - file uploads
*    operationId: getAllFiles
*    security:
*       - bearerAuth: []
*    description: Use to request information on all files from the database
*    responses: 
*      200: 
*          description: Successful response
*      401: 
*          description: Missing authorization
*      404:
*          description: No files available
*/
router.get('/getAllFiles', audioFileController.getAllFiles);

// lists info on all files from a certain genre
/** 
* @swagger
*  /api/v1/audioFiles/getFilesByGenre: 
*   get: 
*    tags:
*      - file uploads
*    operationId: getFilesByGenre
*    security:
*       - bearerAuth: []
*    description: Use to request information on all files from a certain genre
*    parameters:
*       - in: query
*         name: genre
*         schema:
*           type: string
*           example: Something
*       - in: query
*         name: page
*         schema:
*           type: integer
*           example: 1
*    responses: 
*      200: 
*          description: Successful response
*      401: 
*          description: Missing authorization
*      404:
*          description: No files available
*/
router.get('/getFilesByGenre', audioFileController.getFilesByGenre);

// lists info on all files from a certain author
/** 
* @swagger
*  /api/v1/audioFiles/getFilesByAuthor: 
*   get: 
*    tags:
*      - file uploads
*    operationId: getFilesByAuthor
*    security:
*       - bearerAuth: []
*    description: Use to request information on all files from a certain author
*    parameters:
*       - in: query
*         name: author
*         schema:
*           type: string
*           example: Someone
*       - in: query
*         name: page
*         schema:
*           type: integer
*           example: 1
*    responses: 
*      200: 
*          description: Successful response
*      401: 
*          description: Missing authorization
*      404:
*          description: No files available
*/
router.get('/getFilesByAuthor', audioFileController.getFilesByAuthor);


// retrieves the user's fav files
/** 
* @swagger
*  /api/v1/audioFiles/getFavouriteFiles: 
*   get: 
*    tags:
*      - favourite files
*    operationId: getFavouriteFiles
*    security:
*       - bearerAuth: []
*    description: Used to fetch a page of the user's favourite files
*    parameters:
*       - in: query
*         name: page
*         schema:
*           type: integer
*           example: 1
*       - in: query
*         name: pageSize
*         schema:
*           type: integer
*           example: 4
*    responses: 
*      200: 
*          description: Successful response
*      401: 
*          description: Missing authorization
*      404:
*          description: No files available
*/
router.get('/getFavouriteFiles', audioFileController.getFavouriteFiles);

// deletes a specific file
/** 
* @swagger
*  /api/v1/audioFiles/deleteFile: 
*   delete: 
*    tags:
*      - file uploads
*    operationId: deleteFile
*    security:
*       - bearerAuth: []
*    description: Used to delete a file from the database
*    requestBody:
*     content:
*      application/x-www-form-urlencoded:
*       schema:
*         type: object
*         properties:
*          fileId:
*           example: 6311f239d67a5113d40edd4c
*           description: ID of the requested file
*           required: true
*           type: string
*    responses: 
*      200: 
*          description: Successful deletion
*      401: 
*          description: Missing authorization
*      500:
*          description: No file was deleted
*/
router.delete('/deleteFile', audioFileController.deleteFile);


// deletes a favourite file based on the provided id
/** 
* @swagger
*  /api/v1/audioFiles/deleteFavouriteFile: 
*   delete: 
*    tags:
*      - favourite files
*    operationId: deleteFavouriteFile
*    security:
*       - bearerAuth: []
*    description: Used to delete a file from the user's favourites
*    requestBody:
*     content:
*      application/x-www-form-urlencoded:
*       schema:
*         type: object
*         properties:
*          fileId:
*           example: 6311f239d67a5113d40edd4c
*           description: ID of the requested file
*           required: true
*           type: string
*    responses: 
*      200: 
*          description: Successful deletion
*      401: 
*          description: Missing authorization
*      500:
*          description: No file was deleted
*/
router.delete('/deleteFavouriteFile', audioFileController.deleteFavouriteFile);

// admin route: returns count of new audio files in the past 7 days
/** 
 * @swagger
 * /api/v1/audioFiles/newFilesCount:
 *   get:
 *     tags:
 *      - admin
 *     operationId: newFilesCount
 *     description: Returns the number of new uploaded files in the last 7 days
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Number of new uploaded files in the last 7 days
 *         content:
 *          application/json:
 *           schema:
 *            type: integer
 *       401: 
 *         description: Missing administrator privileges
 *       500:
 *         description: Error fetching new files
 */
router.get('/newFilesCount', audioFileController.getNewFilesCount);

module.exports = router;