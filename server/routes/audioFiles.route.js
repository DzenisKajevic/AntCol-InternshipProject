const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const audioFileController = require('../controllers/audioFile.controller');
const db = require('../services/db.service');

const deleteImage = id => {
    if (!id || id === 'undefined') return res.status(400).send('no file id');
    const _id = new mongoose.Types.ObjectId(id);
    db.gfs.delete(_id, err => {
        if (err) return res.status(500).send('file deletion error');
    });
}

router.post('/upload/', db.uploadMiddleware, async (req, res) => {
    const file = req.file;
    const maxFileSize = 50000000;
    //console.log(file);
    //console.log(file.id); // new ObjectId("63089baa5332bdaa63b9a84b")
    if (file.size > maxFileSize) {
        deleteImage(file.id);
        console.log(`The file can't be larger than ${maxFileSize / 1000000}MB`);
        return res.status(400).send(`The file can't exceed ${maxFileSize / 1000000}MB`);
    }
    return res.send(file.id);
});


router.get('/get/:id', ({ params: { id } }, res) => {
    if (!id || id === 'undefined') return res.status(400).send('no file id');
    // also check if the id is valid (not implemented yet)

    const _id = new mongoose.Types.ObjectId(id);
    db.gfs.find({ _id }).toArray((err, files) => {
        if (!files || files.length === 0) return res.status(400).send('no files exist');
        db.gfs.openDownloadStream(_id).pipe(res); // streams the data to the user through a stream if successful
    });
});


//router.route('/delete/id').post(audioFileController.delete);

module.exports = router;