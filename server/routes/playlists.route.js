const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const playlistsController = require('../controllers/playlists.controller');

// creates an empty playlist
/**
* @swagger
* /api/v1/playlists/createEmptyPlaylist:
*   post:
*     tags:
*      - playlists
*     description: Create an empty playlist
*     operationId: createEmptyPlaylist
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
*           playlistName:
*            example: playlist
*            description: Name of the playlist
*            required: true
*            type: string
*           visibility:
*            example: public
*            description: Determines whether other people can see the playlist (default private)
*            type: string
*     responses:
*       201:
*         description: Successfully created an empty playlist
*       401: 
*         description: Missing authorization
*       500:
*         description: Error creating playlist || A playlist with that name already exists
*/
router.post('/createEmptyPlaylist', playlistsController.createEmptyPlaylist);

// adds file(s) to a playlist
/**
* @swagger
* /api/v1/playlists/addFilesToPlaylist:
*   post:
*     tags:
*      - playlists
*     description: Adds an array of files to the given playlist
*     operationId: addFilesToPlaylist
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     requestBody:
*      content:
*       application/json:
*        schema:
*          type: object
*          properties:
*           fileIDs:
*            description: Array of files to add to the playlist
*            required: true
*            type: array
*            items:
*               type: string
*            example: ["6319df61a90e1bb08558b952", "6319df5ea90e1bb08558b945"]
*           playlistId:
*            required: true
*            example: 6319cff93d2d3593b1e53174
*            description: ID of the playlist to add the files to
*            type: string
*     responses:
*       201:
*         description: Successfully added the file(s) to the playlist
*       401: 
*         description: Missing authorization
*       404:
*         description: Can't add non-existing file to the playlist || Can\'t add files to that playlist
*       500:
*         description: Error adding file to the playlist
*/
router.post('/addFilesToPlaylist', playlistsController.addFilesToPlaylist);

// removes file(s) from a playlist
/**
* @swagger
* /api/v1/playlists/removeFilesFromPlaylist:
*   delete:
*     tags:
*      - playlists
*     description: Removes an array of items from the given playlist
*     operationId: removeFilesFromPlaylist
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     requestBody:
*      content:
*       application/json:
*        schema:
*          type: object
*          properties:
*           fileIDs:
*            description: Array of files to remove from the playlist
*            required: true
*            type: array
*            items:
*               type: string
*            example: ["6319df61a90e1bb08558b952", "6319df5ea90e1bb08558b945"]
*           playlistId:
*            required: true
*            example: 6319cff93d2d3593b1e53174
*            description: ID of the playlist to add the files to
*            type: string
*     responses:
*       201:
*         description: Successfully removed the file(s) from the playlist
*       401: 
*         description: Missing authorization
*       404:
*         description: Can't remove non-existing file to the playlist || Can\'t remove files from that playlist
*       500:
*         description: Error removing file from the playlist
*/
router.delete('/removeFilesFromPlaylist', playlistsController.removeFilesFromPlaylist);

// updates playlist visibility
/**
* @swagger
* /api/v1/playlists/updatePlaylistVisibility:
*   put:
*     tags:
*      - playlists
*     description: Updates the visibility of a given playlist
*     operationId: updatePlaylistVisibility
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
*           visibility:
*            description: Visibility of the playlist (public / private)
*            required: true
*            example: public
*            type: string
*           playlistId:
*            required: true
*            example: 6319cff93d2d3593b1e53174
*            description: ID of the playlist to change the visibility of
*            type: string
*     responses:
*       201:
*         description: Successfully changed the visibility
*       401: 
*         description: Missing authorization
*       404:
*         description: Playlist not found
*       500:
*         description: Error updating playlist visibility
*/
router.put('/updatePlaylistVisibility', playlistsController.updatePlaylistVisibility);


// updates playlist visibility
/**
* @swagger
* /api/v1/playlists/updatePlaylistName:
*   put:
*     tags:
*      - playlists
*     description: Updates the name of a given playlist
*     operationId: updatePlaylistName
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
*           playlistName:
*            description: New name of the playlist
*            required: true
*            example: Playlist1
*            type: string
*           playlistId:
*            required: true
*            example: 6319cff93d2d3593b1e53174
*            description: ID of the playlist to change the name of
*            type: string
*     responses:
*       201:
*         description: Successfully changed the name
*       401: 
*         description: Missing authorization
*       404:
*         description: Playlist not found
*       500:
*         description: Error updating playlist name
*/
router.put('/updatePlaylistName', playlistsController.updatePlaylistName);

// returns a specific playlist
/** 
* @swagger
*  /api/v1/playlists/getPlaylistById/{playlistId}: 
*   get: 
*    tags:
*      - playlists
*    operationId: getPlaylistById
*    produces:
*       -application/json
*    security:
*       - bearerAuth: []
*    description: Used to fetch a single playlist by its ID
*    parameters:
*       - in: path
*         name: playlistId
*         schema:
*           type: string
*           required: true
*           example: 6319cff93d2d3593b1e53174
*    responses: 
*      200: 
*          description: Successfully retrieved the playlist
*      401: 
*          description: Missing authorization
*      404:
*          description: Playlist not found
*      500:
*          description: Error fetching playlist
*/
router.get('/getPlaylistById/:playlistId', playlistsController.getPlaylistById);

// returns all playlists of a user -> post since body needs to be sent
/** 
* @swagger
*  /api/v1/playlists/getPlaylists: 
*   get: 
*    tags:
*      - playlists
*    operationId: getPlaylists
*    produces:
*       - application/json
*    security:
*       - bearerAuth: []
*    description: Use to fetch multiple playlists from a user (GET request due to userID being sent)
*    parameters:
*       - in: query
*         name: userId
*         description: ID of the user whose playlists we're viewing
*         required: true
*         example: 6311e6c692a2db96a4bfbbb0
*         type: string
*       - in: query
*         name: page
*         example: 1
*         description: Current page
*         type: number
*       - in: query
*         name: pageSize
*         example: 10
*         description: Number of playlists per page
*         type: number
*    responses: 
*      200: 
*          description: Successfully retrieved playlists
*      401: 
*          description: Missing authorization
*      404:
*          description: No playlists found
*      500:
*          description: Error fetching playlists
*/
router.get('/getPlaylists', playlistsController.getPlaylists);

// deletes a single playlist
/** 
* @swagger
*  /api/v1/playlists/deletePlaylist: 
*   delete: 
*    tags:
*      - playlists
*    operationId: deletePlaylist
*    produces:
*       - application/json
*    security:
*       - bearerAuth: []
*    description: Used to delete a single playlist
*    requestBody:
*      content:
*       application/x-www-form-urlencoded:
*        schema:
*          type: object
*          properties:
*           playlistId:
*            description: ID of the playlist to be deleted
*            required: true
*            example: 631affd3e7d8d2d311b83710
*            type: string
*    responses: 
*      200: 
*          description: Successfully deleted the playlist
*      401: 
*          description: Missing authorization
*      404:
*          description: No playlist found
*      500:
*          description: Error deleting playlist
*/
router.delete('/deletePlaylist', playlistsController.deletePlaylist);

// shares a playlist with specified users
/**
* @swagger
* /api/v1/playlists/sharePlaylist:
*   put:
*     tags:
*      - playlists
*     description: Shares a playlist with specified
*     operationId: sharePlaylist
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     requestBody:
*      content:
*       application/json:
*        schema:
*          type: object
*          properties:
*           usersToShareWith:
*            description: Array of user IDs to share the playlist with
*            required: true
*            type: array
*            items:
*               type: string
*            example: ["6311dea3f6b92981caa95e06", "6319d0f6e31017e8b08c1d86"]
*           playlistId:
*            required: true
*            example: 6319cff93d2d3593b1e53174
*            description: ID of the playlist to share with other users
*            type: string
*     responses:
*       201:
*         description: Successfully shared the playlist
*       401: 
*         description: Missing authorization
*       404:
*         description: Playlist not found || Could not find any users with those IDs
*       500:
*         description: Error sharing playlist
*/
router.put('/sharePlaylist', playlistsController.sharePlaylist);

// revokes playlist sharing with specified users
/**
* @swagger
* /api/v1/playlists/revokePlaylistShare:
*   put:
*     tags:
*      - playlists
*     description: Revokes playlist sharing with specified users
*     operationId: revokePlaylistShare
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     requestBody:
*      content:
*       application/json:
*        schema:
*          type: object
*          properties:
*           usersToShareWith:
*            description: Array of user IDs to share the playlist with
*            required: true
*            type: array
*            items:
*               type: string
*            example: ["6311dea3f6b92981caa95e06", "6319d0f6e31017e8b08c1d86"]
*           playlistId:
*            required: true
*            example: 6319cff93d2d3593b1e53174
*            description: ID of the playlist to share with other users
*            type: string
*     responses:
*       201:
*         description: Successfully revoked playlist sharing from specified users
*       401: 
*         description: Missing authorization
*       404:
*         description: Playlist not found
*       500:
*         description: Error revoking playlist sharing
*/
router.put('/revokePlaylistShare', playlistsController.revokePlaylistShare);

module.exports = router;