const Review = require("../models/review");

const getReviewsByBookId = async (bookId, limit) => {
    const reviews = await Review.find({ bookId })
        .sort({ date: -1 })
        .populate("userId")
        .limit(limit);

    return reviews;
};

const createReview = async (review) => {
    const createdReview = await (
        await Review.create(review)
    ).populate("userId");

    return createdReview;
};

const getReviewById = async (reviewId) => {
    const review = await Review.findOne(reviewId);

    return review;
};

module.exports = {
    getReviewsByBookId,
    createReview,
    getReviewById,
};
