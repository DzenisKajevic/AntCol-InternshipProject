//express controller = php service
const users = require('../services/usersAuth.service');
const { StatusError } = require('../utils/helper.util');

async function register(req, res, next) {
    try {
        res.status(201).send(await users.register(req.body));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        if (err.message.startsWith("E11000 duplicate key error"))
            next(new StatusError(err.message, `An account with that email already exists`, 500));
        next(new StatusError(null, err.message, err.statusCode));
    }
}

async function login(req, res, next) {
    try {
        console.log(req.body);
        res.status(200).send(await users.login(req.body));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error while logging in\n`, err);
        next(new StatusError(null, err.message, err.statusCode || 500));
    }
}

async function renameUser(req, res, next) {
    try {
        res.status(200).send(await users.renameUser(req.user, req.body.newUsername));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }

        console.error(`Error updating username\n`, err);
        next(new StatusError(err.message, `Error updating username`, 500));
    }
}

// admin
async function getNewUsersCount(req, res, next) {
    try {
        res.status(200).send(await users.getNewUsersCount());
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error('Error fetching new users\n', err);
        next(new StatusError(err.message, 'Error fetching new users\n', 500));
    }
}

module.exports = {
    register,
    login,
    getNewUsersCount,
    renameUser
};