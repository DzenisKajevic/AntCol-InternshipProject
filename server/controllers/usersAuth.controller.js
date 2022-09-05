//express controller = php service
const users = require('../services/usersAuth.service');
const { StatusError } = require('../utils/helper.util');

async function register(req, res, next) {
    try {
        res.status(201).send(await users.register(req.body));
    } catch (err) {
        if (err.message.startsWith("E11000 duplicate key error"))
            next(new StatusError(err.message, `An account with that email already exists`, 500));
    }
}

async function login(req, res, next) {
    try {
        res.status(200).send(await users.login(req.body));
    } catch (err) {
        console.error(`Error while logging in\n`, err);
        next(new StatusError(err.message, `Error while logging in`, err.statusCode || 500));
    }
}

// admin
async function getNewUsersCount(req, res, next) {
    try {
        res.status(200).send(await users.getNewUserCount());
    }
    catch (err) {
        console.error('Error fetching new users\n', err);
        next(new StatusError(err.message, 'Error fetching new users\n', 500));
    }
}

module.exports = {
    register,
    login,
    getNewUsersCount
};