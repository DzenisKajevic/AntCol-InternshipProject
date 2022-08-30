const { StatusError } = require("../utils/helper.util");

function handleErrors(err, req, res, next) {
    res.status(err.statusCode || 500);
    res.send(err.message);
    return;
}

module.exports = {
    handleErrors
}