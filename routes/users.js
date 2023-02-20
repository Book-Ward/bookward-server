const express = require('express');
const router = express.Router()
const supabase_middleware = require('../middlewares/authentication-middleware');
const usersController = require('../controllers/users-controller');
const recommendationsController = require('../controllers/recommendations-controller');

router.get("/users/info/:userId", supabase_middleware, usersController.getUserInfo);
router.post("/users", usersController.createUser);
router.post("/users/:bookId/books/saved", supabase_middleware, usersController.saveBook);
router.post("/users/followed", supabase_middleware, usersController.followUser);
router.get("/users/search", supabase_middleware, usersController.searchUsers);
router.get("/users/following", supabase_middleware, usersController.getFollowing)

router.post("/recommend/:userId", supabase_middleware, recommendationsController.sendRecommendation);
router.get("/recommendations", supabase_middleware, recommendationsController.getUnseenRecommendations);
router.post("/recommendation/:id/acknowledged", supabase_middleware, recommendationsController.acknowledgeRecommendation);

module.exports = router;