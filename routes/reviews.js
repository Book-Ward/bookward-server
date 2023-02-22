const express = require('express');
const router = express.Router()
const {
    reviewMiddleware,
    reviewOwnershipMiddleware
} = require("../middlewares/middleware")
const supabase_middleware = require('../middlewares/authentication-middleware');
const reviewsController = require("../controllers/reviews-controller");


router.get("/books/:bookId/reviews", reviewsController.getBookReviews);
router.post("/books/:bookId/reviews", supabase_middleware, reviewsController.postBookReview);
router.delete("/books/:bookId/reviews", reviewOwnershipMiddleware, reviewsController.deleteBookReview);
router.put("/reviews/:reviewId/upvoted", reviewMiddleware, supabase_middleware, reviewsController.upvoteBookReview);

module.exports = router;