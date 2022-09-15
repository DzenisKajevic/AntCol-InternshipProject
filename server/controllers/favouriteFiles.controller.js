const favouriteFilesService = require('../services/favouriteFiles.service');
const { StatusError } = require('../utils/helper.util');
const helperUtil = require('../utils/helper.util');

async function addFileToFavourites(req, res, next) {
    try {
        //console.log(req.user);
        res.status(201).send(await favouriteFilesService.addFileToFavourites(req.user.userId, req.body.fileId));
    } catch (err) {
        console.error(`Error adding file to favourites\n`, err);
        if (err.message.startsWith("E11000 duplicate key error")) next(new StatusError(err.message, `Selected file is already a favourite`, 500));
        else next(new StatusError(err.message, `Error adding file to favourites`, 500));
    }
}

async function getFavouriteFiles(req, res, next) {
    try {
        res.status(200).send(await favouriteFilesService.getFavouriteFiles(req.user.userId, req.query));
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
        res.status(200).send(await favouriteFilesService.deleteFavouriteFile(req.user.userId, req.body.fileId));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error deleting favourite file\n`, err);
        next(new StatusError(err.message, `Error deleting favourite file`, 500));
    }
};

module.exports = {
    addFileToFavourites,
    getFavouriteFiles,
    deleteFavouriteFile,
};