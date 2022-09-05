// might install Joi -> used for validating data

// cd node_modules\.bin
// jshint ../../index.js

const generalConfig = require('./configs/general.config');
const dbConnection = require('./services/db.service');
const usersAuthRoute = require('./routes/usersAuth.route');
const audioFilesRouter = require('./routes/audioFiles.route');
const middleware = require('./middleware/middleware');
const { morgan } = require('./utils/helper.util');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.set('debug', true);
app.use(express.json());

// creates a file for logs
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// logs requestsapp.use(morgan(':timestamp reqId: :id userToken: :userJWTToken :remote-addr :http-version :method :url :status :total-time'));
// changes output location to the file
app.use(morgan(':timestamp reqId: :id userToken: :userJWTToken :remote-addr :http-version :method :url :status Error: :fetchError :total-time', { stream: accessLogStream }));
//app.use(morgan(':timestamp reqId: :id userToken: :userJWTToken :remote-addr :http-version :method :url :status Error: :fetchError :total-time'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
    }
    catch (error) {
        console.log(error);
    }
};
start();