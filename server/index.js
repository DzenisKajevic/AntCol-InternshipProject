// might install Joi -> used for validating data

// cd node_modules\.bin
// jshint ../../index.js

const generalConfig = require('./configs/general.config');
const dbConnection = require('./services/db.service');
const usersAuthRoute = require('./routes/usersAuth.route');
const audioFilesRouter = require('./routes/audioFiles.route');
const middleware = require('./middleware/middleware');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());

// creates a file for logs
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// logs requests
app.use(morgan(':timestamp reqId: :id userToken: :userJWTToken :remote-addr :http-version :method :url :status :total-time'));
// changes output location to the file
app.use(morgan(':timestamp reqId: :id userToken: :userJWTToken :remote-addr :http-version :method :url :status :total-time', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// custom token that fetches the id of the request
// which is set in assignId()
morgan.token('id', function getId(req) {
    return req.id;
});

// I should finish this later!!! 
morgan.token('userJWTToken', function (req, res, param) {
    return "Not Implemented Yet";
});

morgan.token('timestamp', function getTimestamp(req) {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + "-"
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() + " ";

    return datetime;
});
app.use(assignId);

app.all('*', middleware.JWTAuth);

app.get('/', (req, res) => {
    res.send("Welcome");
});

// route middleware
app.use('/api/v1/auth', usersAuthRoute);
app.use('/api/v1/audioFiles', audioFilesRouter);

// error handler middleware
app.use(middleware.handleErrors);

function assignId(req, res, next) {
    req.id = uuidv4();
    next();
}

const start = async () => {
    try {
        const port = generalConfig.expressPort;
        app.listen(port, () => console.log(`Listening on port ${port}.`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    try {
        await dbConnection.connect();
        // used for file uploads / downloads... 
        await dbConnection.setupStorageEngine();
        /* console.log(dbConnection.collectionName);
        //console.log(dbConnection.connectionInstance);
        console.log(dbConnection.getConnectionInstance());
        console.log(dbConnection.dbURI);
        console.log(dbConnection.gfs);
        console.log(dbConnection.storage); */

    }
    catch (error) {
        console.log(error);
    }
};
start();