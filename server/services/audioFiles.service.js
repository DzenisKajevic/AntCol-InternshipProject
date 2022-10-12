const db = require('../utils/db.service');
const AudioFile = require('../models/AudioFile');
const FavouriteFile = require('../models/FavouriteFile');
const FileReview = require('../models/FileReview');
const Playlist = require('../models/Playlist');
const { StatusError } = require('../utils/helper.util');
const mongoose = require('mongoose');
const util = require('../utils/helper.util');
const Notification = require('../models/Notifications');

async function deleteFileHelper(id) {
    if (!id || id === 'undefined') return 'The file id was not provided';
    const _id = new mongoose.Types.ObjectId(id);
    await db.getAudioGfs().delete(_id, err => {
        if (err) throw new StatusError('file deletion error', 500);
    });
};

async function deleteFile(user, fileId) {
    const file = await AudioFile.findOne({ _id: fileId });
    if (!file) throw new StatusError(null, 'Can\'t delete non-existing file', 404);
    if ((user.userId === file.metadata.uploadedBy) || (user.role === 'Admin')) {
        const obj_id = new mongoose.Types.ObjectId(fileId);
        await db.getAudioGfs().delete(obj_id);
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

async function uploadFile(req, res) {
    // file is uploaded at this point
    console.log("File", req.file);
    const reviewInformation = {
        'fileId': req.file.id, 'reviewStatus': "Needs to be reviewed", 'description': null,
        'adminId': null, 'adminName': null, 'reviewTerminationDate': null
    };

    // try-catch for creating a review
    try {
        const review = await (await FileReview.create(reviewInformation)).populate('fileId');
        // if review is successfully created, send notification to user
        try {
            await Notification.create({
                'notificationTime': review.fileId.uploadDate, 'userId': review.fileId.metadata.uploadedBy,
                'description': `The uploaded file ${review.fileId.filename} is currently under review`
            });
            //console.log(file);
            return req.file.id;
        }
        catch (err) {
            console.log('Error sending notification, but the file was uploaded normally', err);
        }
    }
    catch (err) {
        console.log(err);
        await deleteFileHelper(req.file.id);
        if (err.message.includes("Validation failed")) throw (new StatusError(err.message, `Required fields are missing`, 500));
        else throw (new StatusError(err.message, `Error uploading file`, 500));
    }
}

async function getFile(req, res) {
    const fileId = req.params.id;
    const user = req.user;

    if (!fileId || fileId === 'undefined') throw new StatusError('File id was not provided', 422);

    //console.log(user.role != 'Admin');
    const _id = mongoose.Types.ObjectId(fileId);
    filters = {};
    filters['_id'] = _id;
    console.log(filters);

    // only admins get to see non-reviewed files
    if (user.role != 'Admin') filters['reviewed'] = true;

    await db.getAudioGfs().find(filters).limit(1).toArray((err, files) => {
        if (!files || files.length === 0) res.status(500).send('A file with that id was not found');
        else {
            const fileSize = files[0].length;
            const rangeHeader = req.get('Range');
            console.log("FileSize: ", fileSize);

            let rangeRequest;
            if (fileSize && rangeHeader) rangeRequest = util.readRangeHeader(rangeHeader, fileSize);
            // if no range is requested, send the whole file
            if (!rangeRequest) {
                console.log("no range req");
                res.setHeader('Content-Type', files[0].contentType);
                res.setHeader('Accept-Ranges', 'bytes');
                db.getAudioGfs().openDownloadStream(_id).pipe(res); // streams the data to the user through a stream if successful
            }
            // otherwise send only the requested portion of the file
            else {
                var start = rangeRequest.Start;
                var end = rangeRequest.End;

                // If the range can't be fulfilled. 
                console.log("Start", start, "End", end);
                if (start > fileSize || end > fileSize) {
                    // Indicate the acceptable range.
                    res.setHeader('Content-Range', 'bytes */' + fileSize); // File size.

                    // Return the 416 'Requested Range Not Satisfiable'.
                    res.status(416).send("Requested bytes are out of range");
                    return;
                }
                res.setHeader('End-Byte', end);
                res.setHeader('Access-Control-Expose-Headers', "End-Byte");
                res.setHeader('Content-Type', files[0].contentType);
                res.setHeader('Accept-Ranges', 'bytes');
                res.setHeader('Cache-Control', 'no-cache');

                // Return 206 'Partial Content'.
                res.status(206);
                console.log(files[0]);
                db.getAudioGfs().openDownloadStream(_id, { start: start, end: end }).pipe(res);
            }
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
async function getAllFiles(user, queryParams, callback) {
    //{ genre, page, pageSize }
    console.log(user)
    let filters = {};
    filters['contentType'] = "audio/mpeg";
    if (user.role !== 'Admin') filters['reviewed'] = true;
    else if (queryParams['reviewed'] === 'true' || queryParams['reviewed'] === 'false') filters['reviewed'] = queryParams['reviewed'];
    Object.keys(queryParams).forEach(key => {
        if (key in util.fileSearchFilters) filters[key] = queryParams[key];
    });

    let page = parseInt(queryParams.page) || 1;
    let pageSize = parseInt(queryParams.pageSize) || 4;
    //if songName is present, use regex to find matching songs
    if (filters['metadata.songName'] !== null) {
        let songNameRegex = filters['metadata.songName'];
        filters['metadata.songName'] = undefined;
        delete filters['metadata.songName'];

        let matchingCount = await AudioFile.count({ $and: [{ 'metadata.songName': { '$regex': new RegExp(songNameRegex, "i") } }, filters] });
        db.getAudioGfs().find({ $and: [{ 'metadata.songName': { '$regex': new RegExp(songNameRegex, "i") } }, filters] }).skip((page - 1) * pageSize).limit(pageSize)
            .toArray((err, files) => {
                if (!files || files.length === 0) {
                    callback(new StatusError(null, 'No files available', 404));
                }
                else {

                    console.log(files);
                    let returnObject = {
                        'searchResults': files,
                        'pageCount': Math.ceil(matchingCount / pageSize)
                    }
                    console.log(returnObject);
                    callback(null, returnObject);
                }
            });
    }
    // else match exact values
    else {
        let matchingCount = await AudioFile.count(filters);
        db.getAudioGfs().find(filters).skip((page - 1) * pageSize).limit(pageSize).toArray((err, files) => {
            if (!files || files.length === 0) {
                callback(new StatusError(null, 'No files available', 404));
            }
            else {
                let returnObject = {
                    'searchResults': files,
                    'pageCount': Math.ceil(matchingCount / pageSize)
                }
                callback(null, returnObject);
            }
        });
    }
};

async function getAllGenres(user, queryParams) {
    //{ page, pageSize }
    let page = parseInt(queryParams.page) || 1;
    let pageSize = parseInt(queryParams.pageSize) || 8;
    let genres = await AudioFile.find().distinct('metadata.genre');
    let numberOfGenres = genres.length;
    genres = genres.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
    let returnObject = {
        'genres': genres,
        'pageCount': Math.ceil(numberOfGenres / pageSize)
    }
    console.log(returnObject);
    return returnObject;
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
        if (key in util.reviewSearchFilters) {
            filters[key] = queryParams[key];
        }
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
        const date = new Date;
        update['reviewed'] = true;
        update['reviewTerminationDate'] = date.toISOString();
        const filter = { '_id': fileId };
        const file = await AudioFile.findOneAndUpdate(
            filter, update, { upsert: false, useFindAndModify: false, new: true });
        await Notification.create({
            'userId': file.metadata.uploadedBy, 'read': false,
            'description': `The uploaded file ${file.filename} has been accepted`,
            'notificationTime': update['reviewTerminationDate']
        });
    }

    else if (status === "Denied") {
        const date = new Date;
        update['reviewTerminationDate'] = date.toISOString();
        const file = await AudioFile.findOne(filter);
        await Notification.create({
            'userId': file.metadata.uploadedBy, 'read': false,
            'description': `The uploaded file ${file.filename} has been rejected`,
            'notificationTime': update['reviewTerminationDate']
        });
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
    getAllGenres,
    getFile,
    getFileInfo,
    getNewFilesCount,
    getFileReviews,
    handleFileReview,
}
