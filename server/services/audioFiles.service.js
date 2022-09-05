const db = require('./db.service');
const AudioFile = require('../models/AudioFile');
const FavouriteFile = require('../models/FavouriteFile');
const { StatusError } = require('../utils/helper.util');
const mongoose = require('mongoose');

/* async function deleteFileHelper(id) {
    if (!id || id === 'undefined') return 'The file id was not provided';
    const _id = new mongoose.Types.ObjectId(id);
    await db.getGfs().delete(_id, err => {
        if (err) throw new StatusError('file deletion error', 500);
    });
}; */

async function deleteFile(fileId) {
    //console.log(fileId);
    const file = await AudioFile.findOne({ _id: fileId })
    const obj_id = new mongoose.Types.ObjectId(fileId);
    await db.getGfs().delete(obj_id);
    await file.remove();
    await FavouriteFile.deleteMany({ 'fileId': fileId })
    return "Successfully deleted the file";
};

async function uploadFile(reqBody, file) {
    const maxFileSize = 50000000; // 50 MB
    const filter = { _id: file.id };
    const update = { author: reqBody.author, genre: reqBody.genre };

    const result = await AudioFile.findOneAndUpdate(
        filter, update, { upsert: true, useFindAndModify: false, new: true });

    console.log(result);
    return file.id;
};

async function addFileToFavourites(userId, fileId) {
    const file = await AudioFile.findOne({ 'fileId': fileId });
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

async function getFile(fileId, res) {
    if (!fileId || fileId === 'undefined') throw new StatusError('File id was not provided', 422);

    const _id = new mongoose.Types.ObjectId(fileId);
    await db.getGfs().find({ _id }).toArray((err, files) => {
        if (!files || files.length === 0) res.status(500).send('A file with that id was not found');
        res.setHeader('Content-Disposition', 'attachment');
        res.setHeader('Content-Type', 'audio/mpeg');
        db.getGfs().openDownloadStream(_id).pipe(res); // streams the data to the user through a stream if successful
    });
};

async function getFileInfo(fileId) {
    if (!fileId || fileId === 'undefined') throw new StatusError(null, 'File id was not provided', 422);
    const result = await AudioFile.findOne({ _id: fileId });
    if (!result) throw new StatusError(null, 'No such file exists', 404);
    return result;
};

async function getAllFiles(callback) {
    db.getGfs().find().toArray((err, files) => {
        // Check if files exist
        if (!files || files.length === 0) {
            callback(new StatusError(null, 'No files available', 404));
        }
        // nothing returns without a callback
        // await / then / catch don't return anything either
        else callback(null, files);
    });
};

async function getFilesByGenre({ genre, page, pageSize }, callback) {
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 4;
    db.getGfs().find({ 'genre': genre }).skip((page - 1) * pageSize).limit(pageSize).toArray((err, files) => {
        if (!files || files.length === 0) {
            callback(new StatusError(null, 'No files available', 404));
        }
        else callback(null, files);
    });
};

async function getFilesByAuthor({ author, page, pageSize }, callback) {
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 4;
    db.getGfs().find({ 'author': author }).skip((page - 1) * pageSize).limit(pageSize).toArray((err, files) => {
        if (err) callback(err);
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

module.exports = {
    deleteFile,
    uploadFile,
    addFileToFavourites,
    getFavouriteFiles,
    deleteFavouriteFile,
    getFile,
    getFileInfo,
    getAllFiles,
    getFilesByGenre,
    getFilesByAuthor,
    getNewFilesCount,
}


// potential pagination 
/*
exports.getAllPosts = async (req, res) => {
    try {
      let query = Post.find();
  
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 4;
      const skip = (page - 1) * pageSize;
      const total = await Post.countDocuments();
  
      const pages = Math.ceil(total / pageSize);
  
      query = query.skip(skip).limit(pageSize);
  
      if (page > pages) {
        return res.status(404).json({
          status: "fail",
          message: "No page found",
        });
      }
  
      const result = await query;
  
      res.status(200).json({
        status: "success",
        count: result.length,
        page,
        pages,
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "Server Error",
      });
    }
  };*/