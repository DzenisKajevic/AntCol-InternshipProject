const mongoose = require('mongoose');
const multer = require('multer');
const dbConfig = require('../configs/db.config');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const crypto = require('crypto');
const path = require('path');


checkFileType = (file, cb) => {
    const reqFiletype = /mp3|ogg|weba|aac|wav/;
    const reqMimetype = /audio/;
    const extname = reqFiletype.test(path.extname(file.originalname).toLowerCase());
    const mimetype = reqMimetype.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('Unsupported file type submitted');
};

const dbService = {
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

            // used for giving random names to files (not needed at the moment)
            /*              (req, file) => {
                            // this function runs every time a new file is created
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
                                        bucketName: dbService.bucketName
                                    };
                                    resolve(fileInfo);
                                });
                            });
                        }  */
        });

        store = multer(
            {
                storage: dbService.storage,
                //limits: { fileSize: 20000000 }, // limits file to 20MB, but it doesn't prevent the file from being uploaded before checking
                fileFilter: function (req, file, cb) {
                    checkFileType(file, cb);
                    //checkFileSize(file, cb); // can't put this here since the file size is unknown at this stage
                    // I will probably end up using limits ^ API response is troublesome though..
                }
            });
    },

    uploadMiddleware: (req, res, next) => {
        // accepts a single file and stores it in req.file
        // the file must be passed with the key: "audioFile", otherwise the request will fail
        const upload = store.single('audioFile');

        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }
            next();
        });
    },

    getConnectionInstance: () => {
        return dbService.dbConnection;
    }
}

module.exports = {
    //dbService: dbService,
    connect: dbService.connectDB,
    getConnectionInstance: dbService.getConnectionInstance,
    //connectionInstance: dbService.dbConnection, // undefined in other files for some reason
    dbURI: dbService.dbURI,
    setupStorageEngine: dbService.setupStorageEngine,
    uploadMiddleware: dbService.uploadMiddleware,
    gfs: dbService.gfs,
    storage: dbService.storage,
    collectionName: dbService.bucketName
}
