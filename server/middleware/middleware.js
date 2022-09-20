const { StatusError } = require("../utils/helper.util");
const jwt = require('jsonwebtoken');
const generalConfig = require('../configs/general.config');
const db = require('../utils/db.service');
const ProfilePic = require("../models/ProfilePic");

function handleErrors(err, req, res, next) {

    // for some reason, err.message is not null, but "null", even though null is passed...
    /* 
    console.log(typeof (null));
    console.log(typeof (err.message));
    console.log(err.message === null);
    console.log(err.message ?? err.additionalMessage);
    req.err = err.message || err.additionalMessage; */
    if ((err.message != "null") || (!err.message)) req.err = err.message;
    else req.err = err.additionalMessage;
    res.status(err.statusCode || 500);
    res.send(err.additionalMessage || err.message);
    return;
};

function JWTAuth(req, res, next) {
    const auth = '/api/v1/auth/';
    const files = '/api/v1/audioFiles/';
    // Skip authorization checking on the following routes: 
    if (req.path === '/' || req.path === auth + 'login' || req.path === auth + 'register' || req.path === '/api-docs') return next();

    //console.log(req.body);
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        req.err = "Missing authorization";
        console.log('Missing authorization');
        return res.status(401).send("Missing authorization");
    }
    // if authHeader is present, split it, else return undefined
    // take the bearer portion of the token away
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, generalConfig.JWT_SECRET, (err, user) => {
        if (err) {
            req.err = "Error: Invalid JWT token";
            console.log('JWT ERROR: ' + err);
            return res.status(401).send("Error: Access Denied");
        }

        req.user = user;
        /* 
        console.log(req.path, files + 'getFileReviews');
        console.log(user); */
        if (req.path === auth + 'newUserCount' || req.path === files + 'newFilesCount'
            || req.path === files + 'getFileReviews' || req.path === files + 'handleFileReview') {
            if (user.role != "Admin") {
                req.err = "Error: Admin role required";
                console.error('JWT ERROR: ' + 'Admin role required');
                return res.status(401).send("Error: Access Denied");
            }
        }
        next();
    });
};

async function audioFileUploadMiddleware(req, res, next) {
    // accepts a single file and stores it in req.file
    // the file must be passed with the key: "audioFile", otherwise the request will fail

    store = await db.setupAudioStorageEngine(req);
    const upload = store.single('audioFile');

    upload(req, res, function (err) {
        //console.log(req.body);
        if (err) {
            console.log(err);
            if (err.message.includes("E11000 duplicate key error")) next(new StatusError(err.message, `File with the same artist / song name already exists`, 500));
            else if (err.message.includes("Validation failed")) next(new StatusError(err.message, `Required fields are missing`, 500));
            else next(new StatusError(err.message, `Error uploading file`, 500));
        }
        next();
    });
};

async function profilePicUploadMiddleware(req, res, next) {
    // accepts a single file and stores it in req.file
    // the file must be passed with the key: "profilePic", otherwise the request will fail

    store = await db.setupProfilePicStorageEngine(req);

    // deletes previous profile picture, replaces it with the new
    const oldProfilePic = await ProfilePic.deleteOne({ 'metadata.uploadedBy': req.user.userId });
    console.log(oldProfilePic);
    const upload = store.single('profilePic');

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            if (err.message.includes("E11000 duplicate key error")) next(new StatusError(err.message, `File with the same artist / song name already exists`, 500));
            else if (err.message.includes("Validation failed")) next(new StatusError(err.message, `Required fields are missing`, 500));
            else next(new StatusError(err.message, `Error uploading file`, 500));
        }
        next();
    });
};



module.exports = {
    handleErrors,
    JWTAuth,
    audioFileUploadMiddleware,
    profilePicUploadMiddleware,
}