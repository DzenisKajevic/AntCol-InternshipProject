const db = require('../utils/db.service');
const { StatusError } = require('../utils/helper.util');
const ProfilePic = require('../models/ProfilePic');

async function deleteFileHelper(id) {
    if (!id || id === 'undefined') return 'The file id was not provided';
    const _id = new mongoose.Types.ObjectId(id);
    await db.getAudioGfs().delete(_id, err => {
        if (err) throw new StatusError('file deletion error', 500);
    });
};

async function deleteFile(user, fileId) {
    const file = await ProfilePic.findOne({ _id: fileId });
    console.log(file); // metadata is defined :)
    console.log(file.filename);
    console.log('file.metadata =', file.metadata); // metadata is undefined :) :)
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

module.exports = {
    uploadFile,
    deleteFile,
}