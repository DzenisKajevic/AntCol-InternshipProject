
const audioFilesService = require('../services/audioFiles.service');

async function deleteFile(req, res, next) {
    try {
        res.status(201).send(await audioFilesService.deleteFile(req.body.id));
    } catch (err) {
        req.err = `Error deleting file`;
        console.error(`Error deleting file\n`, err);
        next(err);
    }
};

async function uploadFile(req, res, next) {
    try {
        res.status(201).send(await audioFilesService.uploadFile(req.body.author, req.file));
    } catch (err) {
        req.err = `Error uploading file`;
        console.error(`Error uploading file\n`, err);
        next(err);
    }
};

async function getFile(req, res, next) {
    try {
        // res is required for the .pipe(res) on the DownloadStream
        await audioFilesService.getFile(req.params.id, res);
    } catch (err) {
        req.err = `Error fetching file`;
        console.error(`Error fetching file\n`, err);
        next(err);
    }
};

async function getFileInfo(req, res, next) {
    try {
        res.status(201).send(await audioFilesService.getFileInfo(req.params.id));
    } catch (err) {
        req.err = `Error fetching file info`;
        console.error(`Error fetching file info\n`, err);
        next(err);
    }
};

async function getFiles(req, res, next) {
    try {
        await audioFilesService.getFiles(res, (err, files) => {
            if (err) {
                console.log("test");
                next(err);
            }
            else if (!err) {
                console.log(files);
                res.send(files);
            }
        });
    } catch (err) {
        req.err = 'Error fetching files';
        console.error(`Error fetching files\n`, err);
        next(err);
    }
};

module.exports = {
    deleteFile,
    uploadFile,
    getFile,
    getFileInfo,
    getFiles
}