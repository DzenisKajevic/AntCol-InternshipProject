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

async function uploadFile(reqBody, file) {
    try {
        const maxFileSize = 50000000; // 50 MB
        const filter = { _id: file.id };
        const update = { author: reqBody.author, genre: reqBody.genre };

        console.log(update);
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

async function getAllFiles(callback) {
    try {
        db.getGfs().find().toArray((err, files) => {
            // Check if files exist
            if (!files || files.length === 0) {
                callback(new StatusError('No files available', 404));
            }
            // nothing returns without a callback
            // await / then / catch don't return anything either
            else callback(null, files);
        });
    }
    catch (err) {
        //console.log(err);
        throw new StatusError('Error fetching files', 500);
    }
};

async function getFilesByGenre(genre, callback) {
    try {
        db.getGfs().find({ 'genre': genre }).toArray((err, files) => {
            if (!files || files.length === 0) {
                callback(new StatusError('No files available', 404));
            }
            else callback(null, files);
        });
    }
    catch (err) {
        throw new StatusError('Error fetching files', 500);
    }
};

async function getFilesByAuthor(author, callback) {
    try {
        db.getGfs().find({ 'author': author }).toArray((err, files) => {
            if (!files || files.length === 0) {
                callback(new StatusError('No files available', 404));
            }
            else callback(null, files);
        });
    }
    catch (err) {
        throw new StatusError('Error fetching files', 500);
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