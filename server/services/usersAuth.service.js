//express service = php dao

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
        let loginUser = await User.findOne({
            email: loginInfo.email
        }).select('+password');
        if (!loginUser) {
            throw new Error('No such user found');
        }
        else {
            const passwordMatches = await loginUser.comparePassword(loginInfo.password);
            if (!passwordMatches) {
                throw new Error('Incorrect password');
            }
            loginUser.password = undefined;
            delete (loginUser.password);
            return loginUser;
        }
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