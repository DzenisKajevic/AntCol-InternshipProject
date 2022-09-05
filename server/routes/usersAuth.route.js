const express = require('express');
const router = express.Router();
const usersAuthController = require('../controllers/usersAuth.controller');

// registers a new user
router.route('/register').post(usersAuthController.register);

// logs an existing user in
router.route('/login').post(usersAuthController.login);

// admin route: fetches the count of newly registered users in the past 7 days
router.route('/newUsersCount').get(usersAuthController.getNewUsersCount);

module.exports = router;



/* var app = express.Router();
app.route('/test')
  .get(function (req, res) {
     //code
  })
  .post(function (req, res) {
    //code
  })
  .put(function (req, res) {
    //code
  }) */