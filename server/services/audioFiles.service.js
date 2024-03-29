const db = require('./db.service');
const AudioFile = require('../models/AudioFile');
const FavouriteFile = require('../models/FavouriteFile');
const FileReview = require('../models/FileReview');
const Playlist = require('../models/Playlist');
const { StatusError } = require('../utils/helper.util');
const mongoose = require('mongoose');
const util = require('../utils/helper.util');

async function deleteFileHelper(id) {
    if (!id || id === 'undefined') return 'The file id was not provided';
    const _id = new mongoose.Types.ObjectId(id);
    await db.getGfs().delete(_id, err => {
        if (err) throw new StatusError('file deletion error', 500);
    });
};

async function deleteFile(user, fileId) {
    const file = await AudioFile.findOne({ _id: fileId })
    if ((user.userId === file.uploadedBy) || (user.role === 'Admin')) {
        const obj_id = new mongoose.Types.ObjectId(fileId);
        await db.getGfs().delete(obj_id);
        await file.remove();
        // deletes the file from everyone's favourites
        await FavouriteFile.deleteMany({ 'fileId': fileId });
        // deletes the file from everyone's playlists 
        await Playlist.updateMany({ 'fileId': fileId }, { $pull: { 'files': fileId } });
        return "Successfully deleted the file";
    }
    else {
        throw new StatusError(null, "Insufficient permissions", 403);
    }
};

async function uploadFile(user, reqBody, file) {
    const filter = { '_id': file.id };
    const update = {
        'reviewed': false, 'author': reqBody.author, 'genre': reqBody.genre,
        'album': reqBody.album, 'songName': reqBody.songName, 'uploadedBy': user.userId
    };

    // try catch for "uploading"
    try {
        const result = await AudioFile.findOneAndUpdate(
            filter, update, { upsert: false, useFindAndModify: false, new: true, runValidators: true });

        const reviewInformation = {
            'fileId': result._id, 'filename': result.filename, 'contentType': result.contentType,
            'uploadDate': result.uploadDate, 'author': reqBody.author, 'genre': reqBody.genre, 'songName': reqBody.songName,
            'uploadedBy': mongoose.Types.ObjectId(user.userId), 'reviewStatus': "Needs to be reviewed", 'adminId': null, 'adminName': null, 'reviewTerminationDate': null
        };

        // try-catch for creating a review
        try {
            const review = await FileReview.create(reviewInformation);
        }
        catch (err) {
            console.log(err);
            await deleteFileHelper(file.id);
            throw new StatusError(null, 'Error adding file to reviews, deleting file', 500);
        }
    }
    catch (err) {
        deleteFileHelper(file.id);
        console.error(`Error uploading file\n`, err);
        if (err.message.includes("E11000 duplicate key error")) throw (new StatusError(err.message, `File with the same artist / song name already exists`, 500));
        else if (err.message.includes("Validation failed")) throw (new StatusError(err.message, `Required fields are missing`, 500));
        else throw (new StatusError(err.message, `Error uploading file`, 500));

    }
    return file.id;
};

async function getFile(user, fileId, res) {
    if (!fileId || fileId === 'undefined') throw new StatusError('File id was not provided', 422);

    console.log(user.role != 'Admin');
    const _id = mongoose.Types.ObjectId(fileId);
    filters = {};
    filters['_id'] = _id;
    console.log(filters);

    // only admins get to see non-reviewed files
    if (user.role != 'Admin') filters['reviewed'] = true;

    await db.getGfs().find(filters).limit(1).toArray((err, files) => {
        if (!files || files.length === 0) res.status(500).send('A file with that id was not found');
        else {
            res.setHeader('Content-Disposition', 'attachment');
            res.setHeader('Content-Type', files[0].contentType);
            // https://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html
            // open download stream start stop: could be used for buffering(?)
            db.getGfs().openDownloadStream(_id).pipe(res); // streams the data to the user through a stream if successful
        }
    });
};

async function getFileInfo(fileId) {
    if (!fileId || fileId === 'undefined') throw new StatusError(null, 'File id was not provided', 422);
    const result = await AudioFile.findOne({ '_id': new mongoose.Types.ObjectId(fileId), reviewed: true }).select("-uploadedBy");
    if (!result) throw new StatusError(null, 'No such file exists', 404);
    return result;
};

// Added filters, removed 2 routes
async function getAllFiles(queryParams, callback) {
    //{ genre, page, pageSize }
    let filters = {};
    filters['contentType'] = "audio/mpeg";
    filters['reviewed'] = true;
    Object.keys(queryParams).forEach(key => {
        if (key in util.fileSearchFilters) filters[key] = queryParams[key];
    });
    console.log(filters);
    //console.log(typeof (keys));
    let page = parseInt(queryParams.page) || 1;
    let pageSize = parseInt(queryParams.pageSize) || 4;
    db.getGfs().find(filters).skip((page - 1) * pageSize).limit(pageSize).toArray((err, files) => {
        if (!files || files.length === 0) {
            callback(new StatusError(null, 'No files available', 404));
        }
        else callback(null, files);
    });
};

// admin
async function getNewFilesCount() {
    const date = new Date();
    const fromDate = date.setDate(date.getDate() - 7);
    fileCount = await AudioFile.countDocuments({ 'createdAt': { $gte: fromDate } });
    return ({ 'newFiles': fileCount });
}

//admin
async function getFileReviews(queryParams) {
    let filters = {};
    Object.keys(queryParams).forEach(key => {
        if (key in util.reviewSearchFilters) filters[key] = queryParams[key];
    });
    const page = parseInt(queryParams.page) || 1;
    const pageSize = parseInt(queryParams.pageSize) || 4;

    const result = await FileReview.find(filters).skip((page - 1) * pageSize).limit(pageSize).populate('fileId');
    return result;
};

//admin
async function handleFileReview(user, fileId, status, description = '') {
    const filter = {};
    filter['fileId'] = fileId;

    const file = await AudioFile.findOne({ '_id': fileId });
    console.log(file);
    if (!file) {
        await FileReview.findOneAndUpdate(
            filter, { 'fileId': fileId, 'reviewStatus': 'Denied', 'adminId': null, 'adminName': null, 'description': 'File was deleted before the review took place' },
            { upsert: false, useFindAndModify: false, new: true });
        console.log(file);
        throw new StatusError(null, 'That file does not exist, closing review', 404);
    }

    const update = {
        'reviewStatus': status,
        'adminId': mongoose.Types.ObjectId(user.userId),
        'adminName': user.username,
        'description': description,
    };

    if (status === "Accepted") {
        console.log("Accepted");
        const date = new Date;
        update['reviewed'] = true;
        update['reviewTerminationDate'] = date.toISOString();
        const filter = { '_id': fileId };
        await AudioFile.findOneAndUpdate(
            filter, update, { upsert: false, useFindAndModify: false, new: true });
    }

    else if (status === "Denied") {
        console.log("Denied");
        const date = new Date;
        update['reviewTerminationDate'] = date.toISOString();
        await deleteFile(fileId);
        // if file doesn't exist, just update the review (in case the description was forgotten)
    }

    else if (status === 'Pending') {
        update['adminId'] = null;
        update['adminName'] = null;
    }

    const result = await FileReview.findOneAndUpdate(
        filter, update, { upsert: false, useFindAndModify: false, new: true }).populate('fileId');
    console.log(result);
    return result;
}

module.exports = {
    deleteFile,
    uploadFile,
    getAllFiles,
    getFile,
    getFileInfo,
    getNewFilesCount,
    getFileReviews,
    handleFileReview,
}
