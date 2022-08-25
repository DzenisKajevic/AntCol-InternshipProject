const User = require('../models/User.js');
const { dbConfig } = require('../configs/db.config');
const helperUtil = require('../utils/helper.util');

// used to prevent SQL injection
//const sanitize = require('mongo-sanitize');


// not used yet
async function getMultiple() { };

async function register(user) {
    try {
        let registeredUser = await User.create({
            //email: sanitize(user.email),
            username: user.username,
            email: user.email,
            password: user.password
        });
        registeredUser.password = undefined;
        delete (registeredUser.password);
        return registeredUser;
    }
    catch (error) {
        throw new Error(error); // Express will catch this on its own.
    }
}

async function login(loginInfo) {
    try {
        let loggedInUser = await User.find({
            email: loginInfo.email,
            password: loginInfo.password
        }).limit(1);
        if (loggedInUser.length) {
            loggedInUser.password = undefined;
            delete (loggedInUser.password);
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