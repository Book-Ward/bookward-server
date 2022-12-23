const express = require('express');
const router = express.Router()
const {
    userMiddleware,
    reviewMiddleware,
    reviewOwnershipMiddleware
} = require("../middlewares/middleware")
const {
    getBookReviews,
    postBookReview,
    deleteBookReview,
    upvoteBookReview
} = require("../services/reviewsService")

router.get("/reviews/:bookId", getBookReviews);
router.post("/reviews", userMiddleware, postBookReview);
router.delete("/reviews/:bookId", reviewOwnershipMiddleware, deleteBookReview);
router.put("/reviews/upvote/:reviewId", reviewMiddleware, upvoteBookReview);

module.exports = router;