const express = require('express');
const router = express.Router()
const {
    getUserInfo,
    saveBook
} = require("../services/userService")

router.post("/users/:userId", getUserInfo);
router.post("/saveBook", saveBook);

module.exports = router;