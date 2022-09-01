
const audioFilesService = require('../services/audioFiles.service');

async function deleteFile(req, res, next) {
    try {
        res.status(201).send(await audioFilesService.deleteFile(req.body.id));
    } catch (err) {
        console.error(`Error deleting file\n`, err);
        next(err);
    }
};

async function uploadFile(req, res, next) {
    try {
        console.log(req.body);
        res.status(201).send(await audioFilesService.uploadFile(req.body, req.file));
    } catch (err) {
        console.error(`Error uploading file\n`, err);
        next(err);
    }
};

async function getFile(req, res, next) {
    try {
        // res is required for the .pipe(res) on the DownloadStream
        await audioFilesService.getFile(req.params.id, res);
    } catch (err) {
        console.error(`Error fetching file\n`, err);
        next(err);
    }
};

async function getFileInfo(req, res, next) {
    try {
        res.status(201).send(await audioFilesService.getFileInfo(req.params.id));
    } catch (err) {
        console.error(`Error fetching file info\n`, err);
        next(err);
    }
};

async function getAllFiles(req, res, next) {
    try {
        await audioFilesService.getAllFiles(res, (err, files) => {
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
        next(err);
    }
};

async function getFilesByGenre(req, res, next) {
    try {
        await audioFilesService.getFilesByGenre(req.query.genre, (err, files) => {
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
        next(err);
    }
};

async function getFilesByAuthor(req, res, next) {
    try {
        await audioFilesService.getFilesByAuthor(req.query.author, (err, files) => {
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
        next(err);
    }
};


module.exports = {
    deleteFile,
    uploadFile,
    getFile,
    getFileInfo,
    getAllFiles,
    getFilesByGenre,
    getFilesByAuthor
}