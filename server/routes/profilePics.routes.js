const express = require('express');
const router = express.Router();
const profilePicController = require('../controllers/profilePics.controller');
const middleware = require('../middleware/middleware');

// EDIT SWAGGER
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
router.post('/uploadFile', middleware.profilePicUploadMiddleware, profilePicController.uploadFile);


// deletes a specific file EDIT SWAGGER
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
router.delete('/deleteFile', profilePicController.deleteFile);


module.exports = router;