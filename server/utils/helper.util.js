// file for additional helper functions and classes
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const generalConfig = require('../configs/general.config');

// object for possible filters (getFiles route)
fileSearchFilters = {};
fileSearchFilters["genre"] = true;
fileSearchFilters["artist"] = true;

paginationOptions = {};
paginationOptions["page"] = true;
paginationOptions["pageSize"] = true;

class StatusError extends Error {
    constructor(originalMessage, additionalMessage, statusCode) {
        super(originalMessage);
        this.additionalMessage = additionalMessage;
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
};

function morganFetchUser(req, res, param) {
    const authHeader = req.headers['authorization'];
    //console.log(authHeader);
    if (!authHeader) {
        return "Empty";
    }
    // if authHeader is present, split it, else return undefined
    // take the bearer portion of the token away
    const token = authHeader && authHeader.split(' ')[1];
    return token;
}

function morganFetchError(req, res, param) {
    if (res.statusCode > 399) return req.err;
    return "-";
}

morgan.token("fetchError", morganFetchError);

// custom token that fetches the id of the request
// which is set in assignId() middleware
morgan.token('id', function getId(req) {
    return req.id;
});

morgan.token('userJWTToken', morganFetchUser);

morgan.token('timestamp', function getTimestamp(req) {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + "-"
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() + " ";

    return datetime;
});

// useless function at the moment. userID is saved in req.user.userId after authenticating anyways
/* async function extractUserIdFromJWT(req) {
    const authHeader = req.headers['authorization'];
    // authorization has already passed (middleware), no need to check again
    const token = authHeader && authHeader.split(' ')[1];
    return jwt.verify(token, generalConfig.JWT_SECRET, (err, user) => {
        //console.log(user); // edit JWT content in User.js
        return user.userId;
    });
} */

module.exports = {
    StatusError,
    morgan,
    fileSearchFilters,
    paginationOptions
    //extractUserIdFromJWT
};