const express = require('express');
const router = express.Router();
const profilePicController = require('../controllers/profilePics.controller');
const middleware = require('../middleware/middleware');

// EDIT SWAGGER
/**
* @swagger
* /api/v1/profilePics/uploadFile:
*   post:
*     tags:
*      - profilePics
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
*               profilePic:
*                type: string
*                format: binary
*                required: true
*     responses:
*       201:
*         description: File successfully uploaded to the database
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
*  /api/v1/profilePics/deleteFile: 
*   delete: 
*    tags:
*      - profilePics
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
*           example: 632979b58b7dc897ce305e3a
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

// returns a specific file
/** 
* @swagger
*  /api/v1/profilePics/getFile: 
*   get: 
*    tags:
*      - profilePics
*    operationId: profilePicGetFile
*    produces:
*       - image/jpg
*       - image/jpeg
*       - image/png
*    security:
*       - bearerAuth: []
*    description: Use to fetch a single file with the specified id
*    parameters:
*       - in: path
*         name: input
*       schema:
*         type: object
*         properties:
*          userId:
*           type: string
*           description: Fetch profile picture based on userId
*          fileId:
*           type: string
*           description: Fetch profile picture based on fileId
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
router.get('/getFile', profilePicController.getFile);

module.exports = router;