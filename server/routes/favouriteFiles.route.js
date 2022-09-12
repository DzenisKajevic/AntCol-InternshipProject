const express = require('express');
const router = express.Router();
const favouriteFilesController = require('../controllers/favouriteFiles.controller');

// adds a file to the user's fav list
/** 
 * @swagger
 * /api/v1/favouriteFiles/addFileToFavourites:
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
router.post('/addFileToFavourites', favouriteFilesController.addFileToFavourites);


// retrieves the user's fav files
/** 
* @swagger
*  /api/v1/favouriteFiles/getFavouriteFiles: 
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
router.get('/getFavouriteFiles', favouriteFilesController.getFavouriteFiles);

// deletes a favourite file based on the provided id
/** 
* @swagger
*  /api/v1/favouriteFiles/deleteFavouriteFile: 
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
router.delete('/deleteFavouriteFile', favouriteFilesController.deleteFavouriteFile);

module.exports = router;
