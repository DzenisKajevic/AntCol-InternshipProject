const express = require('express');
const router = express.Router();
const usersAuthController = require('../controllers/usersAuth.controller');


// user schema
/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    required:
 *      -email
 *      -password
 *    properties:
 *      userId:
 *        type: string
 *        description: Auto-generated id of the user
 *      email:
 *        type: string
 *        description: User's email address
 *      username:
 *        type: string
 *        description: User's username
 *      password:
 *        type: string
 *        description: User's password
 *      role:
 *        type: string
 *        description: Role which determines user's permissions
 *      createdAt:
 *        type: string/date-time
 *        desription: Date when the user was created
 *    example:
 *      userId: 6311dea3f6b92981caa95e06
 *      email: email@gmail.com
 *      username: tempUser
 *      password: pass123
 *      role: Basic
 *      createdAt: 2022-09-02T10:44:51.516Z
 * */

// registers a new user

/** 
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *      - auth
 *     operationId: Register
 *     description: Register an account
 *     produces:
 *       - application/json
 *     requestBody:
 *      content:
 *       application/x-www-form-urlencoded:
 *        schema:
 *          type: object
 *          properties:
 *           email:
 *            example: email@gmail.com
 *            description: User's password.
 *            required: true
 *            type: string
 *           password:
 *            example: pass123
 *            description: User's password.
 *            required: true
 *            type: string
 *           username:
 *            example: tempUser
 *            description: User's desired username
 *            required: true
 *            type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *       500:
 *         description: An account with that email already exists
 */
router.route('/register').post(usersAuthController.register);

// logs an existing user in
/** 
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *      - auth
 *     operationId: Login
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     requestBody:
 *      content:
 *       application/x-www-form-urlencoded:
 *        schema:
 *          type: object
 *          properties:
 *           email:
 *            example: email@gmail.com
 *            description: User's password.
 *            required: true
 *            type: string
 *           password:
 *            example: pass123
 *            description: User's password.
 *            required: true
 *            type: string
 *     responses:
 *       200:
 *         description: The user was logged in
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *       401:
 *         description: All credentials have to be provided
 *       404:
 *         description: No such user found
 *       422:
 *         description: All credentials need to be provided
 *       500:
 *         description: Error fetching new users
 */
router.route('/login').post(usersAuthController.login);

// admin route: fetches the count of newly registered users in the past 7 days

/** 
 * @swagger
 * /api/v1/auth/newUsersCount:
 *   get:
 *     tags:
 *      - admin
 *     operationId: newUsersCount
 *     description: Returns the number of new registered users in the last 7 days
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Number of new users registered in the last 7 days
 *         content:
 *          application/json:
 *           schema:
 *            type: integer
 *       401: 
 *         description: Missing administrator privileges
 *       500:
 *         description: Error fetching new users
 */
router.route('/newUsersCount').get(usersAuthController.getNewUsersCount);

router.route('/renameUser').put(usersAuthController.renameUser);

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