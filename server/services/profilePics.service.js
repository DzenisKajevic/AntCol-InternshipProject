const db = require('../utils/db.service');
const { StatusError } = require('../utils/helper.util');
const ProfilePic = require('../models/ProfilePic');
const mongoose = require('mongoose');

async function deleteFileHelper(id) {
    if (!id || id === 'undefined') return 'The file id was not provided';
    const _id = new mongoose.Types.ObjectId(id);
    await db.getProfilePicGfs().delete(_id, err => {
        if (err) throw new StatusError('file deletion error', 500);
    });
};

async function deleteFile(user, fileId) {
    const file = await ProfilePic.findOne({ _id: fileId });

    if (!file) throw new StatusError(null, 'Can\'t delete non-existing file', 404);
    if ((user.userId === file.metadata.uploadedBy) || (user.role === 'Admin')) {
        const obj_id = new mongoose.Types.ObjectId(fileId);
        await db.getProfilePicGfs().delete(obj_id);
        await file.remove();
        return "Successfully deleted the file";
    }
    else {
        throw new StatusError(null, "Insufficient permissions", 403);
    }
};

async function uploadFile(file) {
    // file upload was finished and added to req.file in the middleware
    console.log(file);
    return file.id;
};

async function getFile(input, res) {
    // search either by fileId, or by userId, since it's unique
    // input : { inputType: "fileId | userId", fileId: null, userId: null}
    //search by fileId, if it's present, otherwise search by userId
    if (input.fileId) {
        const _id = mongoose.Types.ObjectId(input.fileId);

        await db.getProfilePicGfs().find({ '_id': _id }).limit(1).toArray((err, files) => {
            console.log(files);
            console.log(err);
            if (!files || files.length === 0) res.status(500).send('A file with that id was not found');
            else {
                //res.setHeader('Content-Disposition', 'attachment');
                res.setHeader('Content-Type', files[0].contentType);
                // https://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html
                // open download stream start stop: could be used for buffering(?)
                db.getProfilePicGfs().openDownloadStream(_id).pipe(res); // streams the data to the user through a stream if successful
            }
        });
    }
    else if (input.userId) {
        const userId = mongoose.Types.ObjectId(input.userId);

        await db.getProfilePicGfs().find({ 'metadata.uploadedBy': userId }).limit(1).toArray((err, files) => {
            console.log("FILE", files);
            console.log(err);
            if (!files || files.length === 0) res.status(500).send('A file with that id was not found');
            else {
                //res.setHeader('Content-Disposition', 'attachment');
                res.setHeader('Content-Type', files[0].contentType);
                // https://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html
                // open download stream start stop: could be used for buffering(?)
                db.getProfilePicGfs().openDownloadStream(files[0]['_id']).pipe(res); // streams the data to the user through a stream if successful
            }
        });
    }
    else throw new StatusError('File id was not provided', 422);
};


module.exports = {
    uploadFile,
    deleteFile,
    getFile
}