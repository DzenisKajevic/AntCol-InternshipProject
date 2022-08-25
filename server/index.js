// might install Joi -> used for validating data
// $env:PORT = 5000

// cd node_modules\.bin
// jshint ../../index.js

// morgan -> used for logging http requests and errors

const generalConfig = require('./configs/general.config');
const dbConfig = require('./configs/db.config');
const dbConnection = require('./services/db.service');
const usersAuthRoute = require('./routes/usersAuth.route');

const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Welcome");
});

app.use('/api/v1/auth', usersAuthRoute);



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
    }
    catch (error) {
        console.log(error);
    }
};
start();