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
    const result = await AudioFile.findOneAndUpdate(
        filter, update, { upsert: true, useFindAndModify: false, new: true });

    const reviewInformation = {
        'fileId': result._id, 'filename': result.filename, 'contentType': result.contentType,
        'uploadDate': result.uploadDate, 'author': reqBody.author, 'genre': reqBody.genre, 'songName': reqBody.songName,
        'uploadedBy': mongoose.Types.ObjectId(user.userId), 'reviewStatus': "Needs to be reviewed", 'adminId': null, 'adminName': null, 'reviewTerminationDate': null
    };

    try {
        const review = await FileReview.create(reviewInformation);
    }
    catch (err) {
        console.log(err);
        await deleteFileHelper(file.id);
        throw new StatusError(null, 'Error adding file to reviews, deleting file', 500);
    }
    return file.id;
};

async function addFileToFavourites(userId, fileId) {
    const file = await AudioFile.findOne({ 'fileId': fileId, 'reviewed': true });
    if (file) {
        let favouriteFile = await FavouriteFile.create({
            userId: userId,
            fileId: fileId
        });
        return favouriteFile;
    }
    throw new StatusError(null, 'Can\'t add non-existing file to favourites', 500);
}

async function deleteFavouriteFile(userId, fileId) {
    const file = await FavouriteFile.deleteOne({ 'userId': userId, 'fileId': fileId });
    if (!file.deletedCount) throw new StatusError(null, 'Error: Nothing was deleted', 500);
    return "Successfully deleted the file";
};

async function getFavouriteFiles(userId, { page, pageSize }) {
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 4;

    // for now, this line is useless, since the userId is extracted from the JWT. Favourite files are private for now
    if (!userId || userId === 'undefined') throw new StatusError(undefined, 'User ID was not provided', 422);
    const files = await FavouriteFile.find({ 'userId': userId }).skip((page - 1) * pageSize).limit(pageSize);
    if (!files || files.length === 0) {
        throw new StatusError(null, 'No files available', 404);
    }
    return files;
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
    const result = await AudioFile.findOne({ _id: new mongoose.Types.ObjectId(fileId), reviewed: true });
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

    const result = await FileReview.find(filters).skip((page - 1) * pageSize).limit(pageSize);
    return result;
};

//admin
async function handleFileReview(user, fileId, status, description = '') {
    const filter = {};
    filter['fileId'] = fileId;

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
            filter, update, { upsert: true, useFindAndModify: false, new: true });
    }

    else if (status === "Denied") {
        console.log("Denied");
        const date = new Date;
        update['reviewTerminationDate'] = date.toISOString();
        try {
            await deleteFile(fileId);
        }
        catch {
            // if file doesn't exist, just update the review (in case the description was forgotten)
        }
    }

    else if (status === 'Pending') {
        update['adminId'] = null;
        update['adminName'] = null;
    }

    const result = await FileReview.findOneAndUpdate(
        filter, update, { upsert: true, useFindAndModify: false, new: true });
    console.log(result);
    return result;
}

module.exports = {
    deleteFile,
    uploadFile,
    addFileToFavourites,
    getFavouriteFiles,
    deleteFavouriteFile,
    getAllFiles,
    getFile,
    getFileInfo,
    getNewFilesCount,
    getFileReviews,
    handleFileReview,
}
