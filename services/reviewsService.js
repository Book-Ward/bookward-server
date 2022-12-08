const Review = require("../models/review");
const User = require("../models/user");

const getBookReviews = async (req, res) => {
    try {
        const data = await Review.find( { bookId: req.params.bookId.toString() } );
        res.status(200).json(data);
    }
    catch(error) {
        res.status(500).json( { message: error.message } );
    };
}

const postBookReview = async (req, res) => {
    try {
        const data = await Review.create(req.body);

        const user = await User.find( { userId: req.body.userId.toString() } );

        if (!user.length) {
            res.status(400).json( { message: "User was not found" } );
        }
    
        res.status(200).json(data);
    }
    catch(error) {
        res.status(500).json( { message: error.message } );
    };
}

const deleteBookReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.bookId.toString());

        if (!review.length) {
            res.status(400).json( { message: "Review was not found" } );
        }

        if (review.userId.toString() !== req.body.userId.toString()) {
            res.status(400).json( { message: "User is not authorized to delete this review" } );
        }

        const data = await Review.findByIdAndDelete(req.params.bookId.toString());

        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json( { message: error.message } );
    };
}

const upvoteBookReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.bookId.toString());

        if (!review.length) {
            res.status(400).json( { message: "Review was not found" } );
        }

        const user = await User.find( { userId: req.body.userId.toString() } );

        if (user.upvotedReviews.includes(review._id.toString())) {
            res.status(400).json( { message: "User has already upvoted this review" } );
        }

        const data = await Review.findByIdAndUpdate(req.params.bookId.toString(), { $inc: {helpful: 1} } );
        res.status(200).json(data);
    }
    catch(error) {
        res.status(500).json( { message: error.message } );
    };
}

module.exports = {
    getBookReviews: getBookReviews,
    postBookReview: postBookReview,
    deleteBookReview: deleteBookReview,
    upvoteBookReview: upvoteBookReview
}