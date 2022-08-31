//express controller = php service

const users = require('../services/usersAuth.service');

async function register(req, res, next) {
    try {
        res.status(201).send(await users.register(req.body));
    } catch (err) {
        console.error(`Error while registering user\n`, err);
        next(err);
    }
}

async function login(req, res, next) {
    try {
        res.status(200).send(await users.login(req.body));
    } catch (err) {
        console.error(`Error while logging in\n`, err);
        next(err);
    }
}

module.exports = {
    register,
    login
};