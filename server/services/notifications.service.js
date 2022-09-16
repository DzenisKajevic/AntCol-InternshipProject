const db = require('./db.service');
const AudioFile = require('../models/AudioFile');
const FavouriteFile = require('../models/FavouriteFile');
const FileReview = require('../models/FileReview');
const Playlist = require('../models/Playlist');
const { StatusError } = require('../utils/helper.util');
const mongoose = require('mongoose');
const Notification = require('../models/Notifications');

async function deleteNotification(user, notificationId) {
    let result;
    if (!notificationId || notificationId === 'undefined') result = await Notification.remove({ 'userId': user.userId });
    else result = await Notification.deleteOne({ 'userId': user.userId, '_id': mongoose.Types.ObjectId(notificationId) });
    if (!result) throw new StatusError(null, 'Error: Nothing was deleted', 500);
    return result;
};

async function createNotification(userId, description) {
    return result = await Notification.create({ 'userId': userId, 'description': description, 'notificationTime': new Date().toISOString() });
    // try-catch for creating a review 
};

async function getNotifications(user) {
    return await Notification.find({ 'userId': user.userId });
};

async function markNotificationAsRead(user, notificationId) {
    let result;
    if (!notificationId || notificationId === 'undefined') result = await AudioFile.updateMany({ 'userId': user.userId },
        { 'read': true }, { new: true, upsert: false });
    else result = await AudioFile.findOneAndUpdate({ '_id': mongoose.Types.ObjectId(notificationId), 'userId': user.userId },
        { 'read': true }, { new: true, upsert: false });
    if (!result) throw new StatusError(null, 'Nothing was updated', 404);
    return result;
};

module.exports = {
    deleteNotification,
    createNotification,
    getNotifications,
    markNotificationAsRead,
}