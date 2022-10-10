//express service = php dao

const User = require('../models/User.js');
const { StatusError } = require('../utils/helper.util');

async function register(user) {
    let registeredUser = await User.create({
        username: user.username,
        email: user.email,
        password: user.password
    });
    registeredUser.password = undefined;
    delete (registeredUser.password);

    const token = registeredUser.createJWT();
    return { registeredUser, token };
}

async function login(loginInfo) {
    if (!loginInfo.email || !loginInfo.password) {
        throw new StatusError('All credentials have to be provided', 422);
    }
    const loginUser = await User.findOne({
        email: loginInfo.email
    }).select('+password');
    if (!loginUser) {
        throw new StatusError('No such user found', 404);
    }
    else {
        // bcrypt compare
        const passwordMatches = await loginUser.comparePassword(loginInfo.password);
        if (!passwordMatches) {
            throw new StatusError('Incorrect password', 401);
        }
        loginUser.password = undefined;
        delete (loginUser.password);
        const token = loginUser.createJWT();
        return { loginUser, token };
    }
}

async function renameUser(user, newUsername) {
    const updatedUser = await User.findOneAndUpdate(
        { 'email': user.email }, { 'username': newUsername },
        { upsert: false, useFindAndModify: false, new: true });

    console.log(updatedUser);
    if (!updatedUser) throw new StatusError(null, 'Unable to update user', 404);
    else {
        return updatedUser;
    }
}

// admin
async function getNewUsersCount() {
    const date = new Date();
    const fromDate = date.setDate(date.getDate() - 7);
    userCount = await User.countDocuments({ 'createdAt': { $gte: fromDate } });
    return ({ 'newUsers': userCount });
}

module.exports = {
    register: register,
    login: login,
    getNewUsersCount,
    renameUser
};