const express = require('express');
const router = express.Router()
const {
    userMiddleware
} = require("../middlewares/middleware");
const supabase_middleware = require('../middlewares/authenticationMiddleware');
const {
    getUserInfo,
    saveBook,
    followUser,
    searchUsers,
    getFollowing,
} = require("../services/userService")
const {
    sendRecommendation,
    getUnseenRecommendations,
    acknowledgeRecommendation,
} = require("../services/recommendationService")

router.post("/users/:userId", supabase_middleware, getUserInfo);
router.post("/saveBook", supabase_middleware, saveBook);
router.post("/followUser", supabase_middleware, followUser);
router.get("/searchUsers/:username", supabase_middleware, searchUsers);
router.get("/followingUsers", supabase_middleware, getFollowing)

router.post("/recommend/:id", supabase_middleware, sendRecommendation);
router.get("/recommendations", supabase_middleware, getUnseenRecommendations);
router.get("/recommendation/acknowledge/:id", supabase_middleware, acknowledgeRecommendation);

module.exports = router;