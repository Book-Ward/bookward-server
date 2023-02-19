const usersService = require("./users-service")
const recommendationRepository = require("../data-access/repositories/recommendation-repository")

const sendRecommendationToUser = async (senderId, receiverId, bookId, message) => {
    const sender = await usersService.getUser(senderId);
    const receiver = await usersService.getUser(receiverId);

    if (!sender || !receiver) {
        throw new Error("Sender and/or receiver are not present.");
    }

    if (sender._id.toString() === receiver._id.toString()) {
        throw new Error("You can't recommend a book to yourself");
    }


    const sameReview = await recommendationRepository.getRecommendationByQuery({
        book: bookId,
        sender: sender._id,
        receiver: receiver._id,
    })

    if (sameReview) {
        throw new Error("You have already recommended this book to this user");
    }

    const recommendation = await recommendationRepository.createRecommendation({
        book: bookId,
        sender: sender._id,
        receiver: receiver._id,
        message: message || "",
    })

    return recommendation;
};

const getUnseenRecommendations = async (userId) => {
    const receiver = await usersService.getUser(userId);

    if (!receiver) {
        throw new Error("User not found");
    }

    const recommendations = await recommendationRepository.getFullUserRecommendations(receiver._id, 10);

    return recommendations;
};

const acknowledgeRecommendation = async (recommendationId, userId) => {
    const recommendation = await recommendationRepository.getRecommendationById(recommendationId);

    if (!recommendation) {
        throw new Error("Recommendation not found");
    }

    const user = await usersService.getUser(userId);
    if (recommendation.receiver.toString() !== user._id.toString()) {
        throw new Error("Unauthorized");
    }

    recommendation.seen = true;
    await recommendation.save();

    return recommendation;
};

module.exports = {
    sendRecommendationToUser,
    getUnseenRecommendations,
    acknowledgeRecommendation,
}