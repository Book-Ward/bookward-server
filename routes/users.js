const express = require('express');
const router = express.Router()
const {
    getUserInfo
} = require("../services/userService")

router.post("/users/:userId", getUserInfo);

module.exports = router;