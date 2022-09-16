const { StatusError } = require('../utils/helper.util');
const mongoose = require('mongoose');
const Notification = require('../models/Notifications');

async function deleteNotification(user, notificationId) {
    let result;
    if (!notificationId || notificationId === 'undefined') result = await Notification.deleteMany({ 'userId': user.userId });
    else result = await Notification.deleteOne({ 'userId': user.userId, '_id': mongoose.Types.ObjectId(notificationId) });
    if (!result) throw new StatusError(null, 'Error: Nothing was deleted', 500);
    return result;
};

async function createNotification(user, userId, description) {
    if (user.role !== 'Admin') throw new StatusError(null, "Error: Access Denied", 403); // only admins can create notifications
    return result = await Notification.create({ 'userId': userId, 'description': description, 'notificationTime': new Date().toISOString() });
    // try-catch for creating a review 
};

async function getNotifications(user, queryParams) {
    let page = parseInt(queryParams.page) || 1;
    let pageSize = parseInt(queryParams.pageSize) || 10;
    return await Notification.find({ 'userId': user.userId }).skip((page - 1) * pageSize).limit(pageSize);
};

async function markNotificationAsRead(user, notificationId) {
    let result;
    if (!notificationId || notificationId === 'undefined') result = await Notification.updateMany({ 'userId': user.userId },
        { 'read': true }, { new: true, upsert: false });
    else result = await Notification.findOneAndUpdate({ '_id': mongoose.Types.ObjectId(notificationId), 'userId': user.userId },
        { 'read': true }, { new: true, upsert: false });
    if (!result) throw new StatusError(null, 'Nothing was updated', 404);

    console.log(result);
    return result;
};

module.exports = {
    deleteNotification,
    createNotification,
    getNotifications,
    markNotificationAsRead,
}