const express = require('express');
const router = express.Router()
const supabase_middleware = require('../middlewares/authentication-middleware');
const usersController = require('../controllers/users-controller');
const recommendationsController = require('../controllers/recommendations-controller');

router.post("/users/:userId", supabase_middleware, usersController.getUserInfo);
router.post("/saveBook", supabase_middleware, usersController.saveBook);
router.post("/followUser", supabase_middleware, usersController.followUser);
router.get("/searchUsers/:username", supabase_middleware, usersController.searchUsers);
router.get("/followingUsers", supabase_middleware, usersController.getFollowing)

router.post("/recommend/:id", supabase_middleware, recommendationsController.sendRecommendation);
router.get("/recommendations", supabase_middleware, recommendationsController.getUnseenRecommendations);
router.get("/recommendation/acknowledge/:id", supabase_middleware, recommendationsController.acknowledgeRecommendation);

module.exports = router;