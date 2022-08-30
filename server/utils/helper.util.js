// file for additional helper functions and classes

class StatusError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
};

module.exports = {
    StatusError
};