const Review = require("../models/review");
const User = require("../models/user");

const getReviewsByBookId = async (bookId) => {
    const data = await Review.find({ bookId: bookId })
        .sort({ date: -1 })
        .populate("userId")
        .limit(20);

    return data;
};

const getBookReviews = async (req, res) => {
    try {
        const data = await getReviewsByBookId(req.params.bookId.toString());

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const postBookReview = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.body.userId.toString() });

        const expandedData = {
            ...req.body,
            userId: user._id,
            date: Date.now(),
        };

        const createdReview = await (
            await Review.create(expandedData)
        ).populate("userId");

        user.reviews.push(createdReview._id);
        user.save();

        res.status(200).json(createdReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBookReview = async (req, res) => {
    try {
        // TODO: validate the author of the review is the same as the user making the request
        const data = await Review.findByIdAndDelete(
            req.params.bookId.toString()
        );

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const upvoteBookReview = async (req, res) => {
    try {
        const review = await Review.findOne(req.params.reviewId.toString());

        const user = await User.find({ userId: req.body.userId.toString() });

        if (user.upvotedReviews.includes(review._id.toString())) {
            res.status(400).json({
                message: "User has already upvoted this review",
            });
        } else {
            const data = await Review.findByIdAndUpdate(
                req.params.reviewId.toString(),
                { $inc: { helpful: 1 } }
            );
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReviewsByBookId: getReviewsByBookId,
    getBookReviews: getBookReviews,
    postBookReview: postBookReview,
    deleteBookReview: deleteBookReview,
    upvoteBookReview: upvoteBookReview,
};
