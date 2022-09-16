const notificationsService = require('../services/notifications.service');
const { StatusError } = require('../utils/helper.util');

async function deleteNotification(req, res, next) {
    try {
        res.status(200).send(await notificationsService.deleteNotification(req.user, req.body.notificationId));
    } catch (err) {
        console.error(`Error deleting notification\n`, err);
        next(new StatusError(err.message, `Error deleting notification`, 500));
    }
};

async function createNotification(req, res, next) {
    try {
        res.status(201).send(await notificationsService.createNotification(req.user, req.body.userId, req.body.description));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error creating notification\n`, err);
        next(new StatusError(err.message, `Error creating notification`, 500));
    }
};

async function getNotifications(req, res, next) {
    try {
        res.status(200).send(await notificationsService.getNotifications(req.user, req.params));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error fetching notifications\n`, err);
        next(new StatusError(err.message, `Error fetching notifications`, 500));
    }
};

async function markNotificationAsRead(req, res, next) {
    try {
        res.status(200).send(await notificationsService.markNotificationAsRead(req.user, req.body.notificationId));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error updating notification\n`, err);
        next(new StatusError(err.message, `Error updating notification`, err.statusCode));
    }
};

module.exports = {
    deleteNotification,
    createNotification,
    getNotifications,
    markNotificationAsRead,
}