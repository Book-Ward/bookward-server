const express = require('express');
const router = express.Router()
const {
    reviewMiddleware,
    reviewOwnershipMiddleware
} = require("../middlewares/middleware")
const supabase_middleware = require('../middlewares/authentication-middleware');
const reviewsController = require("../controllers/reviews-controller");


router.get("/reviews/:bookId", reviewsController.getBookReviews);
router.post("/reviews", supabase_middleware, reviewsController.postBookReview);
router.delete("/reviews/:bookId", reviewOwnershipMiddleware, reviewsController.deleteBookReview);
router.put("/reviews/upvote/:reviewId", reviewMiddleware, supabase_middleware, reviewsController.upvoteBookReview);

module.exports = router;