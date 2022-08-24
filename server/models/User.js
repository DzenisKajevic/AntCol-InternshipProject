const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username can\'t be empty'],
        minlength: 4,
        maxlength: 25,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'Valid email required'
        },
        unique: true // creates an index in the db
    },
    password: {
        type: String,
        required: [true, 'Password can\'t be empty'],
        minlength: 6,
        select: false
    }
});

module.exports = mongoose.model("User", userSchema);