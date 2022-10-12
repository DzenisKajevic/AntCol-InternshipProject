const mongoose = require('mongoose');
const multer = require('multer');
const dbConfig = require('../configs/db.config');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const crypto = require('crypto');
const path = require('path');

// deep populate in mongoose
/* SomeModel
  .find()
  .populate({
    path : 'userId',
    populate : {
      path : 'reviewId'
    }
  })
  .exec(function (err, res) {

  }) */

checkAudioFileType = (file, cb) => {
    const reqFiletype = /mp3|ogg|weba|aac|wav/;
    const reqMimetype = /audio/;
    const extname = reqFiletype.test(path.extname(file.originalname).toLowerCase());
    const mimetype = reqMimetype.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('Unsupported file type submitted');
};
checkMetadata = (req, cb) => {
    let metadata = req.body;
    const requiredMetadata = ["genre", "author", "songName", "album"];
    const hasOwnProperty = Object.hasOwnProperty.bind(metadata)
    const hasAllKeys = requiredMetadata.every(item => hasOwnProperty(item));

    if (!hasAllKeys) cb("Some required metadata was left out");
}

checkImageFileType = (file, cb) => {
    const reqFiletype = /jpg|jpeg|png/;
    const reqMimetype = /image/;
    const extname = reqFiletype.test(path.extname(file.originalname).toLowerCase());
    const mimetype = reqMimetype.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('Unsupported file type submitted');
};

const dbService = {
    profilePicStore: null,
    audioStore: null,
    profilePicBucketName: 'profilePics',
    audioBucketName: 'audioFiles',
    profilePicStorage: null,
    audioStorage: null, // all of these variables are in use, 
    profilePicGfs: null,
    audioGfs: null, // VSC shows them as "unused" for some reason
    dbConnection: null,
    dbURI: `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,

    connectDB: async function () {
        try {
            console.log(`Connecting to ${dbService.dbURI}`);
            await mongoose.connect(dbService.dbURI, {
                maxPoolSize: 50,
                authSource: dbConfig.database,
                user: dbConfig.user,
                pass: dbConfig.password,
            });
            dbService.dbConnection = mongoose.connection;
            dbService.audioGfs = new mongoose.mongo.GridFSBucket(dbService.dbConnection.db, {
                bucketName: dbService.audioBucketName
            });
            dbService.profilePicGfs = new mongoose.mongo.GridFSBucket(dbService.dbConnection.db, {
                bucketName: dbService.profilePicBucketName
            });
            console.log("Connected to DB");
        }
        catch (e) {
            console.log(e);
        }
    },

    setupAudioStorageEngine: async function () {
        // Create storage engine
        dbService.audioStorage = new GridFsStorage({
            url: dbService.dbURI,
            bucketName: dbService.audioBucketName,
            file: (req, file) => {
                let metadata = req.body;

                metadata['reviewed'] = 'false';
                metadata['uploadedBy'] = mongoose.Types.ObjectId(req.user.userId);
                return new Promise((resolve, reject) => {
                    const filename = path.basename(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: dbService.audioBucketName,
                        metadata: metadata
                    };
                    resolve(fileInfo);
                });
            }
        });

        dbService.audioStore = multer(
            {
                storage: dbService.audioStorage,
                limits: { fileSize: 50000000 }, // limits file to 50MB
                fileFilter: function (req, file, cb) {
                    checkAudioFileType(file, cb);
                    checkMetadata(req, cb);
                }
            });
        return dbService.audioStore;
    },

    setupProfilePicStorageEngine: async function () {
        // Create storage engine
        dbService.profilePicStorage = new GridFsStorage({
            url: dbService.dbURI,
            bucketName: dbService.profilePicBucketName,
            file: (req, file) => {
                let metadata = {
                    'uploadedBy': mongoose.Types.ObjectId(req.user.userId)
                };
                return new Promise((resolve, reject) => {
                    // use the crypto package to generate a random name for the file
                    // I'll probably remove this later
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err);
                        }
                        const filename = buf.toString('hex') + path.extname(file.originalname);
                        const fileInfo = {
                            filename: filename,
                            bucketName: dbService.profilePicBucketName,
                            metadata: metadata
                        };
                        resolve(fileInfo);
                    });
                });
            }
        });

        dbService.profilePicStore = multer(
            {
                storage: dbService.profilePicStorage,
                limits: { fileSize: 10000000 }, // limits file to 10MB
                fileFilter: function (req, file, cb) {
                    checkImageFileType(file, cb);
                }
            });

        return dbService.profilePicStore;
    },

    getConnectionInstance: () => {
        return dbService.dbConnection;
    },

    /*     getAudioStore: () => {
            return dbService.audioStore;
        }, */
    getAudioGfs: () => {
        return dbService.audioGfs;
    },
    getProfilePicGfs: () => {
        return dbService.profilePicGfs;
    }
}



module.exports = {
    //dbService: dbService,
    /*     getAudioStore: dbService.getAudioStore,
        getProfilePicStore: dbService.getAudioStore, */
    connect: dbService.connectDB,
    getConnectionInstance: dbService.getConnectionInstance,
    getAudioGfs: dbService.getAudioGfs,
    getProfilePicGfs: dbService.getProfilePicGfs,
    //connectionInstance: dbService.dbConnection, // undefined in other files for some reason
    dbURI: dbService.dbURI,
    setupProfilePicStorageEngine: dbService.setupProfilePicStorageEngine,
    setupAudioStorageEngine: dbService.setupAudioStorageEngine,
    //gfs: dbService.gfs,
    audioStorage: dbService.audioStorage,
    audioCollectionName: dbService.audioBucketName,
    profilePicStorage: dbService.profilePicStorage,
    profilePicCollectionName: dbService.profilePicCollectionName
}
