
const audioFilesService = require('../services/audioFiles.service');
const { StatusError } = require('../utils/helper.util');
const helperUtil = require('../utils/helper.util');

async function deleteFile(req, res, next) {
    try {
        res.status(201).send(await audioFilesService.deleteFile(req.user, req.body.fileId));
    } catch (err) {
        console.error(`Error deleting file\n`, err);
        next(new StatusError(err.message, `Error deleting file`, 500));
    }
};

async function uploadFile(req, res, next) {
    try {
        res.status(201).send({ "fileId": await audioFilesService.uploadFile(req.user, req.body, req.file) });
    } catch (err) {
        console.error(`Error uploading file\n`, err);
        next(new StatusError(err.message, `Error uploading file`, 500));
    }
};

async function addFileToFavourites(req, res, next) {
    try {
        //console.log(req.user);
        res.status(201).send(await audioFilesService.addFileToFavourites(req.user.userId, req.body.fileId));
    } catch (err) {
        console.error(`Error adding file to favourites\n`, err);
        if (err.message.startsWith("E11000 duplicate key error")) next(new StatusError(err.message, `Selected file is already a favourite`, 500));
        else next(new StatusError(err.message, `Error adding file to favourites`, 500));
    }
}

async function getFavouriteFiles(req, res, next) {
    try {
        res.status(201).send(await audioFilesService.getFavouriteFiles(req.user.userId, req.query));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }

        console.error(`Error fetching file info\n`, err);
        next(new StatusError(err.message, `Error fetching favourite files`, 500));
    }
}

async function deleteFavouriteFile(req, res, next) {
    try {
        res.status(201).send(await audioFilesService.deleteFavouriteFile(req.user.userId, req.body.fileId));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error deleting favourite file\n`, err);
        next(new StatusError(err.message, `Error deleting favourite file`, 500));
    }
};

async function getFile(req, res, next) {
    try {
        // res is required for the .pipe(res) on the DownloadStream
        await audioFilesService.getFile(req.user, req.params.id, res);
    } catch (err) {
        console.error(`Error fetching file\n`, err);
        next(new StatusError(err.message, `Error fetching file`, 500));
    }
};

async function getFileInfo(req, res, next) {
    try {
        res.status(200).send(await audioFilesService.getFileInfo(req.params.id));
    } catch (err) {
        console.error(`Error fetching file info\n`, err);
        next(new StatusError(err.message, `Error fetching file info`, err.statusCode));
    }
};

async function getAllFiles(req, res, next) {
    try {
        await audioFilesService.getAllFiles(req.query, (err, files) => {
            if (err) {
                next(err);
            }
            else if (!err) {
                console.log(files);
                res.send(files);
            }
        });
    } catch (err) {
        console.error(`Error fetching files\n`, err);
        next(new StatusError(err.message, `Error fetching files`, err.statusCode || 500));
    }
};
// admin
async function getNewFilesCount(req, res, next) {
    try {
        res.status(200).send(await audioFilesService.getNewFilesCount());
    }
    catch (err) {
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
        console.error('Could not handle file review\n', err);
        next(new StatusError(err.message, 'Could not handle file review\n', 500));
    }
}

module.exports = {
    deleteFile,
    uploadFile,
    addFileToFavourites,
    getFavouriteFiles,
    deleteFavouriteFile,
    getFile,
    getFileInfo,
    getAllFiles,
    getNewFilesCount,
    getFileReviews,
    handleFileReview,
}