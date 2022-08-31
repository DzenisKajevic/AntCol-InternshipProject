const { StatusError } = require("../utils/helper.util");
const jwt = require('jsonwebtoken');
const generalConfig = require('../configs/general.config');
const db = require('../services/db.service');

function handleErrors(err, req, res, next) {
    res.status(err.statusCode || 500);
    res.send(err.message);
    return;
};

function JWTAuth(req, res, next) {
    // Skip authorization checking on the following routes: 
    if (req.path == '/' || req.path == '/api/v1/auth/login' || req.path == '/api/v1/auth/register') return next();

    //console.log(req.body);
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log('Missing authorization');
        return res.status(401).send("Missing authorization");
    }
    // if authHeader is present, split it, else return undefined
    // take the bearer portion of the token away
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, generalConfig.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('JWT ERROR: ' + err);
            return res.status(401).send("Error: Access Denied");
        }
        req.user = user;
        next();
    });
};

function uploadMiddleware(req, res, next) {
    // accepts a single file and stores it in req.file
    // the file must be passed with the key: "audioFile", otherwise the request will fail
    const upload = db.getStore().single('audioFile');

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        next();
    });
};


module.exports = {
    handleErrors,
    JWTAuth,
    uploadMiddleware
}