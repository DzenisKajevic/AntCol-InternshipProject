const express = require('express');
const router = express.Router();
const audioFileController = require('../controllers/audioFiles.controller');
const middleware = require('../middleware/middleware');
const multer = require("multer");
const upload = multer();

// File Review Schema
/**
 * @swagger
 * components:
 *  schemas:
 *   File Review:
 *    type: object
 *    required:
 *      -fileId
 *      -filename
 *      -contentType
 *      -author
 *      -genre
 *      -songName
 *      -uploadedBy
 *      -uploadDate
 *      -reviewStatus
 *    properties:
 *      _id:
 *        type: string
 *        description: Auto-generated id of the review
 *      fileId:
 *        type: string
 *        description: ID of the file under review
 *      filename:
 *        type: string
 *        description: Name of the file under review
 *      contentType:
 *        type: string
 *        description: Format of the file under review
 *      author:
 *        type: string
 *        description: Author of the file
 *      genre:
 *        type: string
 *        description: Genre of the file
 *      songName:
 *        type: string
 *        description: Name of the song
 *      uploadedBy:
 *        type: string
 *        desription: Date when the file was created
 *      uploadDate:
 *        type: string/date-time
 *        desription: Date when the file was created
 *      reviewStatus:
 *        type: string
 *        desription: The current state of the review
 *      adminId:
 *        type: string
 *        desription: ID of the admin that's reviewing the file
 *      adminName:
 *        type: string
 *        desription: Name of the admin that's reviewing the file
 *      reviewTerminationDate:
 *        type: string
 *        desription: Date when the review was finished / edited
 *      description:
 *        type: string
 *        desription: Conclusion about the review
 *    example:
 *      _id: 63185c5163b128f4415d0c04
 *      fileId: 63185c5163b128f4415d0bf9
 *      filename: 91476_Glorious_morning.mp3
 *      contentType: audio/mpeg
 *      author: Someone
 *      genre: Something
 *      songName: Glorious Morning
 *      uploadedBy: 6311e6c692a2db96a4bfbbb0
 *      uploadDate: 2022-09-02T10:44:51.516Z
 *      reviewStatus: Denied
 *      adminId: 6311e6c692a2db96a4bfbbb0
 *      adminName: admin
 *      reviewTerminationDate: 2022-09-07T10:34:39.905Z
 *      description: The file doesn't meet the requirements
 * */

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
*               songname:
*                type: string
*                example: Glorious Morning
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
*               the `fileId` parameter in `GET /api/v1/favouriteFiles/addFileToFavourites`.
*           AddFileToFavourites:
*             operationId: addFileToFavourites
*             parameters:
*               fileId: '$response.body#/fileId'
*             description: >
*               The `fileId` value returned in the response can be used as
*               the `fileId` parameter in `POST /api/v1/favouriteFiles/addFileToFavourites`.
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
router.post('/uploadFile', middleware.audioFileUploadMiddleware, audioFileController.uploadFile);

// returns a specific file, ready for playback
/** 
* @swagger
*  /api/v1/audioFiles/getFile/{fileId}: 
*   get: 
*    tags:
*      - audioFiles
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
*      - audioFiles
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
*      - audioFiles
*    operationId: getAllAudioFiles
*    security:
*       - bearerAuth: []
*    description: Use to request information on all files from the database based on filters
*    parameters:
*      - in: query
*        name: filters
*        required: false
*        schema:
*          type: object
*          example:
*            genre: Something
*            author: Someone
*      - in: query
*        name: pagination
*        required: false
*        schema:
*          type: object
*          example:
*            page: 1
*            pageSize: 4
*    responses: 
*      200: 
*          description: Successful response
*      401: 
*          description: Missing authorization
*      404:
*          description: No files available
*/
router.get('/getAllFiles', audioFileController.getAllFiles);

// lists all available genres (with pagination)
/** 
* @swagger
*  /api/v1/audioFiles/getAllGenres: 
*   get: 
*    tags:
*      - audioFiles
*    operationId: getAllGenres
*    security:
*       - bearerAuth: []
*    description: Fetches all available genres from the database
*    parameters:
*      - in: query
*        name: pagination
*        required: false
*        schema:
*          type: object
*          example:
*            page: 1
*            pageSize: 8
*    responses: 
*      200: 
*          description: Successful response
*      401: 
*          description: Missing authorization
*      404:
*          description: No files available
*/
router.get('/getAllGenres', audioFileController.getAllGenres);

// deletes a specific file
/** 
* @swagger
*  /api/v1/audioFiles/deleteFile: 
*   delete: 
*    tags:
*      - audioFiles
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

// admin

/** 
* @swagger
* /api/v1/audioFiles/getFileReviews:
*   get:
*     tags:
*      - admin
*     operationId: getFileReviews
*     description: Returns file reviews based on filters
*     produces:
*       - application/json
*     security:
*       - bearerAuth: []
*     parameters:
*      - in: query
*        name: filters
*        required: false
*        schema:
*          type: object
*          example:
*            reviewStatus: Denied
*            adminId: 6311dea3f6b92981caa95e06
*            adminName: tempUser
*            filename: 91476_Glorious_morning.mp3
*            songName: Glorious Morning
*            author: Someone
*            genre: Something
*      - in: query
*        name: pagination
*        required: false
*        schema:
*          type: object
*          example:
*            page: 1
*            pageSize: 4
*     responses:
*       200:
*         description: Paginated list of file reviews based on filters
*         content:
*          application/json:
*           schema:
*            type: integer
*       401: 
*         description: Missing administrator privileges
*       500:
*         description: Could not fetch file reviews
*/
router.get('/getFileReviews', audioFileController.getFileReviews);

// admin
/** 
 * @swagger
 * /api/v1/audioFiles/handleFileReview:
 *   post:
 *     tags:
 *      - admin
 *     operationId: handleFileReview
 *     description: Check the file out, set to "Pending", "Under review", "Accepted" or "Denied"
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
 *            example: 63185c5163b128f4415d0bf9
 *            description: ID of the requested file
 *            required: true
 *            type: string
 *           status:
 *            example: Denied
 *            required: true
 *            type: string
 *           description:
 *            example: The file doesn't meet the requirements
 *            type: string
 *     responses:
 *       201:
 *         description: Review handling successful
 *       401: 
 *         description: Missing administrator privileges
 *       500:
 *         description: Could not handle file review
 */
router.post('/handleFileReview', audioFileController.handleFileReview);

module.exports = router;