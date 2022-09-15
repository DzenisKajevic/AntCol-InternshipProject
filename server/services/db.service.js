const mongoose = require('mongoose');
const multer = require('multer');
const dbConfig = require('../configs/db.config');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
//const crypto = require('crypto');
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

checkFileType = (file, cb) => {
    const reqFiletype = /mp3|ogg|weba|aac|wav/;
    const reqMimetype = /audio/;
    const extname = reqFiletype.test(path.extname(file.originalname).toLowerCase());
    const mimetype = reqMimetype.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('Unsupported file type submitted');
};

const dbService = {
    store: null,
    bucketName: 'audioFiles',
    storage: null, // all of these variables are in use, 
    gfs: null, // VSC shows them as "unused" for some reason
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
            })
            //console.log(this.dbConnection);
            dbService.dbConnection = mongoose.connection;
            //console.log(this.dbConnection);
            dbService.gfs = new mongoose.mongo.GridFSBucket(dbService.dbConnection.db, {
                bucketName: dbService.bucketName
            });
            console.log("Connected to DB");
        }
        catch (e) {
            console.log(e);
        }
    },

    setupStorageEngine: async function () {
        // Create storage engine
        dbService.storage = new GridFsStorage({
            url: dbService.dbURI,
            bucketName: dbService.bucketName,
            file: (req, file) => {
                // this function runs every time a new file is created
                return new Promise((resolve, reject) => {
                    const filename = path.basename(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: dbService.bucketName
                    };
                    resolve(fileInfo);
                });
            }
        });

        dbService.store = multer(
            {
                storage: dbService.storage,
                limits: { fileSize: 50000000 }, // limits file to 50MB
                fileFilter: function (req, file, cb) {
                    checkFileType(file, cb);
                }
            });
    },


    getStore: () => {
        return dbService.store;
    },
    getConnectionInstance: () => {
        return dbService.dbConnection;
    },
    getGfs: () => {
        return dbService.gfs;
    }
}

module.exports = {
    //dbService: dbService,
    getStore: dbService.getStore,
    connect: dbService.connectDB,
    getConnectionInstance: dbService.getConnectionInstance,
    getGfs: dbService.getGfs,
    //connectionInstance: dbService.dbConnection, // undefined in other files for some reason
    dbURI: dbService.dbURI,
    setupStorageEngine: dbService.setupStorageEngine,
    //gfs: dbService.gfs,
    storage: dbService.storage,
    collectionName: dbService.bucketName
}
