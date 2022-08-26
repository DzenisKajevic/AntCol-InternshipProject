const mongoose = require('mongoose');
const multer = require('multer');
const dbConfig = require('../configs/db.config');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const crypto = require('crypto');
const path = require('path');

let storage; // all of these variables are in use, 
let gfs; // VSC shows them as "unused" for some reason
let dbConnection;
const dbURI = `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

async function connectDB() {
    try {
        console.log(`Connecting to ${dbURI}`);
        await mongoose.connect(dbURI, {
            maxPoolSize: 50,
            authSource: dbConfig.database,
            user: dbConfig.user,
            pass: dbConfig.password,
        })
        dbConnection = mongoose.connection;
        this.gfs = new mongoose.mongo.GridFSBucket(dbConnection.db, {
            bucketName: 'audioFiles'
        });
        console.log("Connected to DB");
    }
    catch (e) {
        console.log(e);
    }
};

async function setupStorageEngine() {
    // Create storage engine
    this.storage = new GridFsStorage({
        url: dbURI,
        file: (req, file) => {
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
                        bucketName: 'audioFiles'
                    };
                    resolve(fileInfo);
                });
            });
        }
    });

    store = multer(
        {
            storage: this.storage,
            //limits: { fileSize: 20000000 }, // limits file to 20MB
            fileFilter: function (req, file, cb) {
                checkFileType(file, cb);
                //checkFileSize(file, cb); // can't put this here since the file size is unknown at this stage
                // I will probably end up using limits ^ API response is troublesome though..
            }
        });
}
function checkFileType(file, cb) {
    const reqFiletype = /mp3|ogg|weba|aac|wav/;
    const reqMimetype = /audio/;
    const extname = reqFiletype.test(path.extname(file.originalname).toLowerCase());
    const mimetype = reqMimetype.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('Unsupported file type submitted');
};

const uploadMiddleware = (req, res, next) => {
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
}

module.exports = {
    connect: connectDB,
    connectionInstance: dbConnection,
    dbURI: dbURI,
    setupStorageEngine: setupStorageEngine,
    uploadMiddleware: uploadMiddleware,
    gfs: this.gfs,
    storage: this.storage,
}
