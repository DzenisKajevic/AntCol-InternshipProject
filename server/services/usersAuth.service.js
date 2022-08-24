// ovdje se pisu kveriji =)
const sanitize = require('mongo-sanitize');

const dbConfig = require('./db.service');
const generalConfig = require('../configs/general.config');
const User = require('../models/User.js');
const { user } = require('../configs/db.config');

async function getMultiple() { };

async function register(user) {
    try {
        const registeredUser = await User.create({
            username: user.username,
            email: user.email,
            password: user.password
        });
        return registeredUser;
    }
    catch (error) {
        throw new Error(error); // Express will catch this on its own.
    }
}

async function login(loginInfo) {
    try {
        const loggedInUser = await User.find({
            email: loginInfo.email,
            password: loginInfo.password
        }).limit(1);
        if (loggedInUser.length) {
            console.log(loggedInUser);
            return loggedInUser;
        }
        else throw new Error('No such user found');
    }
    catch (error) {
        throw new Error(error);
    }
}


module.exports = {
    register: register,
    login: login
};
/* 
module.exports.register = register;
module.exports.login = login; */