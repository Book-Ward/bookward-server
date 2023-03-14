const User = require('../data-access/models/user')
const Review = require('../data-access/models/review')
const Book = require('../data-access/models/book')

const reviewMiddleware = async (req, res, next) => {
    const review = await Review.findById(req.params?.reviewId?.toString());

    if (!review) {
        res.status(400).json( { message: "Review was not found" } );
    } else {
        next();
    }
}

const reviewOwnershipMiddleware = async (req, res, next) => {
    const review = await Review.findById(req.params?.reviewId?.toString());

    if (!review) {
        res.status(400).json( { message: "Review was not found" } );
    } else if (review.userId.toString() !== req.body.userId.toString()) {
        res.status(400).json( { message: "User is not authorized to make changes on this review" } );
    } else {
        next();
    }
}
module.exports = {
    reviewMiddleware: reviewMiddleware,
    reviewOwnershipMiddleware: reviewOwnershipMiddleware,
}