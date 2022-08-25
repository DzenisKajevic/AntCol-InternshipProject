const users = require('../services/usersAuth.service');

const register = async (req, res) => {
    try {
        const user = await users.register(req.body);
        const token = user.createJWT();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            message: error.message,
            error: error
        });
        console.error(error);
    }
}

const login = async (req, res) => {
    try {
        res.status(200).send(await users.login(req.body));
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            message: error.message,
            error: error
        });
        console.error(error);
    }
}


module.exports.register = register;
module.exports.login = login;