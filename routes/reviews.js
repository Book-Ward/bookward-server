const express = require('express');
const router = express.Router()
const {
    getBookReviews,
    postBookReview,
    deleteBookReview,
    upvoteBookReview
} = require("../services/reviewsService")

router.get("/reviews/:bookId", getBookReviews);
router.post("/reviews", postBookReview);
router.delete("/reviews/:bookId", deleteBookReview);
router.put("/reviews/:bookId", upvoteBookReview);

module.exports = router;