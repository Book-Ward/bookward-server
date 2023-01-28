const User = require('../models/user')
const Review = require('../models/review')
const Book = require('../models/book')

const userMiddleware = async (req, res, next) => {
    const userId = req.body?.userId?.toString()
    const email = req.body?.email?.toString()
    const name = req.body?.username?.toString()

    const user = await User.findOne( { userId } );

    if (user)
    {
        next();

        return;
    }

    if (!user && userId && email && name) { 
        await User.create( { userId, email, name } );

        next();

        return;
    } else {
        res.status(400).json( { message: "Missing user metadata" } )

        return;
    }
}

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

const bookMiddleware = async (req, res, next) => {
    const book = await Book.findById(req.params?.bookId?.toString());

    if (!book) {
        res.status(400).json( { message: "Book was not found" } );
    } else {
        next();
    }
}

module.exports = {
    userMiddleware: userMiddleware,
    reviewMiddleware: reviewMiddleware,
    reviewOwnershipMiddleware: reviewOwnershipMiddleware,
    bookMiddleware: bookMiddleware
}