//express service = php dao

const User = require('../models/User.js');

async function register(user) {
    try {
        let registeredUser = await User.create({
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
            // bcrypt compare
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