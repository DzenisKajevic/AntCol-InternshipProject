const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');

/** 
 * @swagger
 * /api/v1/notifications/createNotification:
 *   post:
 *     tags:
 *      - notifications
 *     operationId: createNotification
 *     description: Manually send a notification to a user
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
 *           userId:
 *            example: 6311e6c692a2db96a4bfbbb0
 *            description: ID of the user to whom the notification should be send
 *            required: true
 *            type: string
 *           description:
 *            description: description / main message of the notification
 *            required: true
 *            type: string
 *            example:  "The uploaded file 91476_Glorious_morning.mp3 is currently under review"
 *     responses:
 *       201:
 *         description: Notification successfully created / sent
 *       500:
 *         description: Error creating notification
 */
router.post('/createNotification', notificationsController.createNotification);

/** 
* @swagger
*  /api/v1/notifications/getNotifications: 
*   get: 
*    tags:
*      - notifications
*    operationId: getNotifications
*    produces:
*       - application/json
*    security:
*       - bearerAuth: []
*    description: Use to fetch multiple notifications from a user
*    parameters:
*       - in: query
*         name: page
*         example: 1
*         description: Current page
*         type: number
*       - in: query
*         name: pageSize
*         example: 10
*         description: Number of notifications per page
*         type: number
*    responses: 
*      200: 
*          description: Successfully retrieved notifications
*      401: 
*          description: Missing authorization
*      404:
*          description: No notifications found
*      500:
*          description: Error fetching notifications
*/
router.get('/getNotifications', notificationsController.getNotifications);

/**
* @swagger
* /api/v1/notifications/markNotificationAsRead:
*   put:
*     tags:
*      - notifications
*     description: Marks one or more (if no id is specified) notifications as "read"
*     operationId: markNotificationAsRead
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     requestBody:
*       notificationId:
*         example: 63243efbe1331e67fe2a7513
*         description: ID of the notification to mark as read
*         type: string
*     responses:
*       200:
*         description: Successfully marked the notification as read
*       401: 
*         description: Missing authorization
*       404:
*         description: Notification not found
*       500:
*         description: Error marking notification
*/
router.put('/markNotificationAsRead', notificationsController.markNotificationAsRead);

/** 
* @swagger
*  /api/v1/notifications/deleteNotification: 
*   delete: 
*    tags:
*      - notifications
*    operationId: deleteNotification
*    security:
*       - bearerAuth: []
*    description: Used to delete a notification from the user's inbox
*    requestBody:
*     content:
*      application/x-www-form-urlencoded:
*       schema:
*         type: object
*         properties:
*          notificationId:
*           example: 6324655ae458a5b4ab11ff9e
*           description: ID of the requested notification
*           required: true
*           type: string
*    responses: 
*      200: 
*          description: Successful deletion
*      401: 
*          description: Missing authorization
*      500:
*          description: Error deleting notification
*/
router.delete('/deleteNotification', notificationsController.deleteNotification);

module.exports = router;