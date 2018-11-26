const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');

const checkAuthentication = require('../middleware/check-authentication');

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuthentication, UserController.user_delete);

module.exports = router;