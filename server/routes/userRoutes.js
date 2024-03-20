const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const passport = require('passport');

router.get("/login/google", UserController.logingoogle);


router.post("/login", UserController.login);

router.get("/api/user", passport.authenticate('jwt', { session: false }), UserController.getUserDetails);

router.get("/api/user/role", passport.authenticate('jwt', { session: false }), UserController.getUserRole);

module.exports = router;