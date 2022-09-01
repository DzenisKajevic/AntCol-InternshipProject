//express controller = php service
const users = require('../services/usersAuth.service');
const { StatusError } = require('../utils/helper.util');

async function register(req, res, next) {
    try {
        res.status(201).send(await users.register(req.body));
    } catch (err) {
        console.error(`Error while registering user\n`, err);
        next(new StatusError(err.message, `Error while registering user`, err.statusCode || 500));
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

module.exports = {
    register,
    login
};