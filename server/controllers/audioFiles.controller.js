const audioFilesService = require('../services/audioFiles.service');
const { StatusError } = require('../utils/helper.util');

async function deleteFile(req, res, next) {
    try {
        res.status(200).send(await audioFilesService.deleteFile(req.user, req.body.fileId));
    } catch (err) {
        console.error(`Error deleting file\n`, err);
        next(new StatusError(err.message, `Error deleting file`, 500));
    }
};

async function uploadFile(req, res, next) {
    try {
        res.status(201).send({ "fileId": await audioFilesService.uploadFile(req, res, next) });
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
        await audioFilesService.getFile(req, res);
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error fetching file\n`, err);
        next(new StatusError(err.message, `Error fetching file`, 500));
    }
};

async function getFileInfo(req, res, next) {
    try {
        res.status(200).send(await audioFilesService.getFileInfo(req.params.id));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error fetching file info\n`, err);
        next(new StatusError(err.message, `Error fetching file info`, err.statusCode));
    }
};

async function getAllFiles(req, res, next) {
    try {
        await audioFilesService.getAllFiles(req.user, req.query, (err, files) => {
            if (err) {
                next(err);
            }
            else if (!err) {
                console.log(files);
                res.send(files);
            }
        });
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error fetching files\n`, err);
        next(new StatusError(err.message, `Error fetching files`, err.statusCode || 500));
    }
};

async function getAllGenres(req, res, next) {
    try {
        res.status(200).send(await audioFilesService.getAllGenres(req.user, req.query));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error('Error fetching genres\n', err);
        next(new StatusError(err.message, 'Error fetching genres\n', 500));
    }
}

// admin
async function getNewFilesCount(req, res, next) {
    try {
        res.status(200).send(await audioFilesService.getNewFilesCount());
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error('Error fetching new files\n', err);
        next(new StatusError(err.message, 'Error fetching new files\n', 500));
    }
}

//admin
async function getFileReviews(req, res, next) {
    try {
        res.status(200).send(await audioFilesService.getFileReviews(req.query));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error('Could not fetch file reviews\n', err);
        next(new StatusError(err.message, 'Could not fetch file reviews\n', 500));
    }
}

//admin
async function handleFileReview(req, res, next) {
    try {
        res.status(201).send(await audioFilesService.handleFileReview(req.user, req.body.fileId, req.body.status, req.body.description));
    }
    catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error('Could not handle file review\n', err);
        next(new StatusError(err.message, 'Could not handle file review\n', 500));
    }
}

module.exports = {
    deleteFile,
    uploadFile,
    getFile,
    getFileInfo,
    getAllFiles,
    getAllGenres,
    getNewFilesCount,
    getFileReviews,
    handleFileReview,
}