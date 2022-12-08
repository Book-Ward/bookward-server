const express = require('express');
const router = express.Router()
const {
    getUserInfo
} = require("../services/userService")

router.get("/users/:userId", getUserInfo);

module.exports = router;