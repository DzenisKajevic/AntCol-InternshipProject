const AudioFile = require('../models/AudioFile');
const FavouriteFile = require('../models/FavouriteFile');
const { StatusError } = require('../utils/helper.util');

async function addFileToFavourites(userId, fileId) {
    const file = await AudioFile.findOne({ '_id': fileId, 'reviewed': true });
    if (file) {
        let favouriteFile = await FavouriteFile.create({
            userId: userId,
            fileId: fileId
        });
        favouriteFile.userId = undefined;
        delete favouriteFile.userId;
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
    const files = await FavouriteFile.find({ 'userId': userId }).skip((page - 1) * pageSize).limit(pageSize).populate('fileId');
    if (!files || files.length === 0) {
        throw new StatusError(null, 'No files available', 404);
    }
    files.forEach(function (file, index) {
        this[index].userId = undefined;
        delete this[index].userId;
    }, files);
    return files;
};

module.exports = {
    addFileToFavourites,
    getFavouriteFiles,
    deleteFavouriteFile
};