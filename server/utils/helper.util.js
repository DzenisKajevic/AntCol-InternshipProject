// file for additional helper functions and classes
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const generalConfig = require('../configs/general.config');

// object for possible filters (getFiles route)
fileSearchFilters = {};
fileSearchFilters["metadata.genre"] = true;
fileSearchFilters["metadata.author"] = true;
fileSearchFilters["metadata.songName"] = true;

reviewSearchFilters = {};
reviewSearchFilters["genre"] = true;
reviewSearchFilters["author"] = true;
reviewSearchFilters["fileId"] = true;
reviewSearchFilters["fileName"] = true;
reviewSearchFilters["songName"] = true;
reviewSearchFilters["uploadedBy"] = true;
reviewSearchFilters["reviewStatus"] = true;
reviewSearchFilters["adminId"] = true;
reviewSearchFilters["adminName"] = true;
reviewSearchFilters["description"] = true;

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

// helper function used for determining byte range for audio file buffering
function readRangeHeader(range, totalLength) {
    /*
     * Example of the method 'split' with regular expression.
     * 
     * Input: bytes=100-200
     * Output: [null, 100, 200, null]
     * 
     * Input: bytes=-200
     * Output: [null, null, 200, null]
     */

    if (range == null || range.length == 0)
        return null;

    var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    var start = parseInt(array[1]);
    var end = parseInt(array[2]);
    var result = {
        Start: isNaN(start) ? 0 : start,
        End: isNaN(end) ? (totalLength) : end
    };

    if (!isNaN(start) && isNaN(end)) {
        result.Start = start;
        result.End = totalLength - 1;
    }

    if (isNaN(start) && !isNaN(end)) {
        result.Start = totalLength - end;
        result.End = totalLength - 1;
    }

    return result;
}

module.exports = {
    StatusError,
    morgan,
    fileSearchFilters,
    paginationOptions,
    reviewSearchFilters,
    readRangeHeader,
};