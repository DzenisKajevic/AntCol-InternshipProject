const mongoose = require('mongoose');
const User = require('./User');

const NotificationSchema = new mongoose.Schema({
    read: {
        type: String,
        required: true,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    },
    notificationTime: {
        type: Date,
        required: true
    }
}, { strictQuery: false });


module.exports = mongoose.model("Notification", NotificationSchema, 'notifications');