const express = require('express');
const router = express.Router()
const {
    reviewMiddleware,
    reviewOwnershipMiddleware
} = require("../middlewares/middleware")
const supabase_middleware = require('../middlewares/authentication-middleware');
const {
    getBookReviews,
    postBookReview,
    deleteBookReview,
    upvoteBookReview
} = require("../services/reviews-service")

router.get("/reviews/:bookId", getBookReviews);
router.post("/reviews", supabase_middleware, postBookReview);
router.delete("/reviews/:bookId", reviewOwnershipMiddleware, deleteBookReview);
router.put("/reviews/upvote/:reviewId", reviewMiddleware, supabase_middleware, upvoteBookReview);

module.exports = router;