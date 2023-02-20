const reivewsRepository = require('../data-access/repositories/review-repository');
const userRepository = require('../data-access/repositories/user-repository');

const getReviewsForBook = async (bookId) => {
    const data = await reivewsRepository.getReviewsByBookId(bookId);

    return data;
};

const createReview = async (bookId, rating, content, user) => {
    const userObj = await userRepository.getUserById(user.id);

    const expandedData = {
        bookId,
        rating,
        content,
        userId: userObj._id,
        date: Date.now(),
    };

    const createdReview = await reivewsRepository.createReview(expandedData);

    userObj.reviews.push(createdReview._id);
    userObj.save();

    return createdReview;
};

const deleteReview = async (user, reviewId) => {
    const review = await reivewsRepository.getReviewById(reviewId);

    if (review.userId.toString() !== user.id) {
        throw new Error('Unauthorized');
    }

    await reivewsRepository.deleteReview(reviewId);
};

const upvoteReview = async (reviewId, user) => {
    if (!user) {
        throw new Error('Unauthorized');
    }

    const review = await reivewsRepository.getReviewById(reviewId);

    if (review.userId.toString() === user.id) {
        throw new Error('Unauthorized');
    }

    const userObj = await userRepository.getUserById(user.id);

    if (userObj.upvotedReviews.includes(review._id.toString())) {
        throw new Error('User has already upvoted this review');
    }

    review.helpful += 1;
    review.save(); 

    userObj.upvotedReviews.push(review._id);
    userObj.save();

    return review;
}

module.exports = {
    getReviewsForBook,
    createReview,
    deleteReview,
    upvoteReview,
}