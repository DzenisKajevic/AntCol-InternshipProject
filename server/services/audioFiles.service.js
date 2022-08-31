const db = require('./db.service');
const AudioFile = require('../models/AudioFile');
const { StatusError } = require('../utils/helper.util');
const mongoose = require('mongoose');

async function deleteFileHelper(id) {
    if (!id || id === 'undefined') return 'The file id was not provided';
    const _id = new mongoose.Types.ObjectId(id);
    await db.getGfs().delete(_id, err => {
        if (err) throw new StatusError('file deletion error', 500);
    });
};

async function deleteFile(fileId) {
    try {
        const file = await AudioFile.findOne({ _id: fileId })

        //if (post.user != req.user.id) {
        // res.status(401).send("Invalid credentials");
        //}

        const obj_id = new mongoose.Types.ObjectId(fileId);
        await db.getGfs().delete(obj_id);
        await file.remove();
        return "Successfully deleted the file";
    }
    catch (err) {
        //console.log(err);
        throw new StatusError('Could not delete the file', 500);
    }
};

async function uploadFile(author, file) {
    try {
        const maxFileSize = 50000000; // 50 MB
        const filter = { _id: file.id };
        const update = { author: author };

        if (file.size > maxFileSize) {
            await deleteFileHelper(file.id);
            console.log(`The file can't be larger than ${maxFileSize / 1000000}MB`);
            return `The file can't exceed ${maxFileSize / 1000000}MB`;
        }

        const result = await AudioFile.findOneAndUpdate(
            filter, update, { upsert: true, useFindAndModify: false, new: true });

        console.log(result);
        return file.id;
    }
    catch (err) {
        //console.log(err);
        throw new StatusError('Could not upload the file', 500);
    }
};

async function getFile(fileId, res) {
    try {
        if (!fileId || fileId === 'undefined') res.status(422).send('The file id was not provided', 422);

        const _id = new mongoose.Types.ObjectId(fileId);
        await db.getGfs().find({ _id }).toArray((err, files) => {
            if (!files || files.length === 0) res.status(500).send('A file with that id was not found');
            db.getGfs().openDownloadStream(_id).pipe(res); // streams the data to the user through a stream if successful
        });
    }
    catch (err) {
        //console.log(err);
        throw new StatusError('Could not fetch the file', 500);
    }
};

async function getFileInfo(fileId) {
    try {
        if (!fileId || fileId === 'undefined') res.status(400).send('File id was not provided');
        const result = await AudioFile.findOne({ _id: fileId });
        return result;
    }
    catch (err) {
        //console.log(err);
        throw new StatusError('Could not fetch the file info', 500);

    }
};

async function getFiles(res, callback) {
    try {
        let result = [];
        db.getGfs().find().toArray((err, files) => {
            // Check if files exist
            if (!files || files.length === 0) {
                callback(new StatusError('No files available', 404));
            }
            // nothing returns without a callback
            // await / then / catch don't return anything either
            callback(null, files);
        });
    }
    catch (err) {
        //console.log(err);
        throw new StatusError('Error fetching files', 500);
    }
};


/* async function getFiles(res) {
    try {
        let result = db.getGfs().find();
        return result;
    }
    catch (err) {
        console.log(err);
        throw new StatusError('Error fetching files', 500);
    }
};
 */
module.exports = {
    deleteFile,
    uploadFile,
    getFile,
    getFileInfo,
    getFiles
}