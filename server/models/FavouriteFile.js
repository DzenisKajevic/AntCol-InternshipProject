const mongoose = require('mongoose');
const validator = require('validator');

const FavouriteFileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID can\'t be empty'],
    },
    fileId: {
        type: String,
        required: [true, 'File ID can\'t be empty'],
    }
});
FavouriteFileSchema.on('index', function (err) {
    if (err) {
        console.error('User index error: %s', err);
    } else {
        console.info('User indexing complete');
    }
});

FavouriteFileSchema.index({ userId: 1, fileId: 1 }, { unique: true });

module.exports = mongoose.model("FavouriteFile", FavouriteFileSchema, 'favouriteFiles');