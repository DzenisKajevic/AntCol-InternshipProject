const users = require('../services/usersAuth.service');

const register = async (req, res) => {
    try {
        //console.log(req.body);
        res.status(201).send(await users.register(req.body));
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
    //await res.send('login');
}


module.exports.register = register;
module.exports.login = login;