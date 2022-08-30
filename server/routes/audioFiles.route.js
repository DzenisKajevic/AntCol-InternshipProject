const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const audioFileController = require('../controllers/audioFile.controller');
const db = require('../services/db.service');
const AudioFile = require('../models/AudioFile');

const deleteFile = async function (id) {
    if (!id || id === 'undefined') return res.status(400).send('no file id');
    const _id = new mongoose.Types.ObjectId(id);
    await db.getGfs().delete(_id, err => {
        if (err) return res.status(500).send('file deletion error');
    });
};

router.delete("/deleteFile", async (req, res, next) => {
    try {
        const file = await AudioFile.findOne({ _id: req.body.id })

        //if (post.user != req.user.id) {
        // res.status(401).send("Invalid credentials");
        //}

        const obj_id = new mongoose.Types.ObjectId(req.body.id);
        await db.getGfs().delete(obj_id);
        await file.remove();
        return res.json("Successfully deleted the file");
    }
    catch {
        res.status(500).send('Could not delete the file');
        //next(new Error('Could not delete the file'));
    }
});

router.post('/upload', db.uploadMiddleware, async (req, res) => {
    try {
        const file = req.file;
        const maxFileSize = 50000000; // 50 MB

        const filter = { _id: file.id };
        const update = { author: req.body.author };
        if (file.size > maxFileSize) {
            await deleteFile(file.id);
            console.log(`The file can't be larger than ${maxFileSize / 1000000}MB`);
            return res.status(400).send(`The file can't exceed ${maxFileSize / 1000000}MB`);
        }

        const result = await AudioFile.findOneAndUpdate(
            filter, update, { upsert: true, useFindAndModify: false, new: true });

        console.log(result);
        return res.send(file.id);
    }
    catch {
        res.status(500).send("Could not upload the file");
    }
});

router.get('/getFile/:id', async ({ params: { id } }, res) => {
    try {
        if (!id || id === 'undefined') return res.status(400).send('no file id');

        const _id = new mongoose.Types.ObjectId(id);
        await db.getGfs().find({ _id }).toArray((err, files) => {
            if (!files || files.length === 0) return res.status(400).send('no files exist');
            db.getGfs().openDownloadStream(_id).pipe(res); // streams the data to the user through a stream if successful
        });
    }
    catch {
        res.status(500).send("Error fetching file");
    }
});

router.get('/getFileInfo/:id', async ({ params: { id } }, res) => {
    try {
        if (!id || id === 'undefined') return res.status(400).send('no file id');
        const result = await AudioFile.findOne({ _id: id });
        res.json(result);
    }
    catch {
        res.status(500).send("Error fetching file info");
    }
});

// lists all uploaded files
router.get('/files', (req, res) => {
    try {
        db.getGfs().find().toArray((err, files) => {
            // Check if files exist
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: 'No files exist'
                });
            }

            return res.json(files);
        });
    }
    catch {
        res.status(500).send("Error fetching files");
    }
});

module.exports = router;