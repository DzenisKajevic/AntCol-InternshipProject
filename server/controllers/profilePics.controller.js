const profilePicsService = require('../services/profilePics.service');
const { StatusError } = require('../utils/helper.util');

async function deleteFile(req, res, next) {
    try {
        res.status(200).send(await profilePicsService.deleteFile(req.user, req.body.fileId));
    } catch (err) {
        console.error(`Error deleting file\n`, err);
        next(new StatusError(err.message, `Error deleting file`, 500));
    }
};

async function uploadFile(req, res, next) {
    try {
        res.status(201).send({ "fileId": await profilePicsService.uploadFile(req.file) });
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error uploading file\n`, err);
        next(new StatusError(err.message, `Error uploading file`, 500));
    }
};

async function getFile(req, res, next) {
    try {
        // res is required for the .pipe(res) on the DownloadStream
        await profilePicsService.getFile(req.query, res);
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error fetching file\n`, err);
        next(new StatusError(err.message, `Error fetching file`, 500));
    }
};

module.exports = {
    deleteFile,
    uploadFile,
    getFile
}