const express = require('express');
const router = express.Router()
const {
    userMiddleware
} = require("../middlewares/middleware")
const {
    getUserInfo,
    saveBook
} = require("../services/userService")

router.post("/users/:userId", userMiddleware, getUserInfo);
router.post("/saveBook", userMiddleware, saveBook);

module.exports = router;