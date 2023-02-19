const Review = require("../data-access/models/review");
const User = require("../data-access/models/user");

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
    const user = res.locals?.data?.data?.user;

    try {
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userObj = await User.findOne({ userId: user.id });

        const expandedData = {
            ...req.body,
            userId: userObj._id,
            date: Date.now(),
        };

        const createdReview = await (
            await Review.create(expandedData)
        ).populate("userId");

        userObj.reviews.push(createdReview._id);
        userObj.save();

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
        const user = res.locals?.data?.data?.user;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userObj = await User.find({ userId: user.id });

        if (userObj.upvotedReviews.includes(review._id.toString())) {
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
