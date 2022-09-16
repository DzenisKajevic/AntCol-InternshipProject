const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');

router.get('/getNotifications', notificationsController.getNotifications);
router.post('/createNotification', notificationsController.createNotification);
router.put('/markNotificationAsRead', notificationsController.markNotificationAsRead);
router.delete('/deleteNotification', notificationsController.deleteNotification);

module.exports = router;