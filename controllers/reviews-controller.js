const reviewsService = require("../services/reviews-service");

const getBookReviews = async (req, res) => {
    const bookId = req.params?.bookId?.toString();

    try {
        const data = await reviewsService.getReviewsForBook(bookId);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const postBookReview = async (req, res) => {
    const user = res.locals?.data?.data?.user;
    const bookId = req.params?.bookId?.toString();
    const rating = req.body?.rating;
    const content = req.body?.content;

    try {
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const review = await reviewsService.createReview(bookId, rating, content, user);

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBookReview = async (req, res) => {
    const user = res.locals?.data?.data?.user;

    try {
        await reviewsService.deleteReview(user, req.params.bookId.toString());

        res.status(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const upvoteBookReview = async (req, res) => {
    const reviewId = req.params?.reviewId
    const user = res.locals?.data?.data?.user;

    try {
        const review = await reviewsService.upvoteReview(reviewId, user);

        res.status(200).json(review);

    } catch (error) {
        if (error.message === "Unauthorized") {
            res.status(401).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBookReviews,
    postBookReview,
    deleteBookReview,
    upvoteBookReview,
};