const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generalConfig = require('../configs/general.config');

const UserSchema = new mongoose.Schema({
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
    },
    role: {
        type: String,
        default: "Basic",
        required: true
    },
    createdAt: {
        type: Date,
        unique: true
    }
});

UserSchema.pre('save', async function () {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    this.createdAt = new Date().toISOString();
});

UserSchema.methods.createJWT = function () {
    return jwt.sign({ 'userId': this._id, 'username': this.username, 'email': this.email, 'role': this.role }, generalConfig.JWT_SECRET);

    // token with expiration time -> not in use at the moment
    //return jwt.sign({ 'userId': this._id, 'username': this.username, 'role': this.role }, generalConfig.JWT_SECRET, { expiresIn: generalConfig.JWT_LIFETIME });
}

UserSchema.methods.comparePassword = async function (pass) {
    return await bcryptjs.compare(pass, this.password);
}

module.exports = mongoose.model("User", UserSchema);