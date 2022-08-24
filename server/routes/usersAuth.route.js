const express = require('express');
const router = express.Router();
const usersAuthController = require('../controllers/usersAuth.controller');

router.route('/register').post(usersAuthController.register);
router.route('/login').post(usersAuthController.login);

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