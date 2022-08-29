const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const audioFileController = require('../controllers/audioFile.controller');
const db = require('../services/db.service');
const AudioFile = require('../models/AudioFile');

const deleteImage = async function (id) {
    if (!id || id === 'undefined') return res.status(400).send('no file id');
    const _id = new mongoose.Types.ObjectId(id);
    await db.gfs.delete(_id, err => {
        if (err) return res.status(500).send('file deletion error');
    });
};

/* router.delete('/deleteFile', async (req, res) => {
    await db.gfs.deleteOne({ _id: req.body.id });
    res.send("Successfully deleted the file");
}); */
/* router.delete("/deleteFile/:fileID", auth, async (req, res) => { */
router.delete("/deleteFile", async (req, res) => {
    try {
        const file = await AudioFile.findOne({ _id: req.body.id });
        console.log(file);
        //if (post.user != req.user.id) {
        // res.status(401).send("Invalid credentials");
        //}

        // gfs.delete() not recognized...
        const obj_id = new mongoose.Types.ObjectId(req.params.imageID);
        db.gfs.delete(obj_id);

        await file.remove();
        res.json("successfully deleted image!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Could not delete file");
    }
});

router.post('/upload/', db.uploadMiddleware, async (req, res) => {
    const file = req.file;
    const maxFileSize = 50000000;
    //console.log(req.body.author);

    const filter = { _id: file.id };
    const filter2 = { length: 2215623 };
    const update = { author: req.body.author };
    console.log(file.id);
    //console.log(file);
    //console.log(file.id); // new ObjectId("63089baa5332bdaa63b9a84b")
    if (file.size > maxFileSize) {
        await deleteImage(file.id);
        console.log(`The file can't be larger than ${maxFileSize / 1000000}MB`);
        return res.status(400).send(`The file can't exceed ${maxFileSize / 1000000}MB`);
    }

    const result = await AudioFile.findOneAndUpdate(
        { _id: file.id }, { author: req.body.author }, { upsert: true, useFindAndModify: false, new: true });

    /* console.log(db); */
    console.log(result);
    return res.send(file.id);
});


router.get('/getFile/:id', async ({ params: { id } }, res) => {
    if (!id || id === 'undefined') return res.status(400).send('no file id');

    const _id = new mongoose.Types.ObjectId(id);
    await db.gfs.find({ _id }).toArray((err, files) => {
        if (!files || files.length === 0) return res.status(400).send('no files exist');
        db.gfs.openDownloadStream(_id).pipe(res); // streams the data to the user through a stream if successful
    });
});

router.get('/getFileInfo/:id', async ({ params: { id } }, res) => {
    if (!id || id === 'undefined') return res.status(400).send('no file id');
    const result = await AudioFile.findOne({ _id: id });
    res.json(result);
});

// lists all uploaded files
router.get('/files', (req, res) => {
    db.gfs.find().toArray((err, files) => {
        // Check if files exist
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }

        return res.json(files);
    });
});
//router.route('/delete/id').post(audioFileController.delete);

module.exports = router;