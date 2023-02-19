const Recommendation = require("../models/recommendation");

const getRecommendationByQuery = async (query) => {
    const recommendation = await Recommendation.findOne(query);

    return recommendation;
}

const getRecommendationById = async (id) => {
    const recommendation = await Recommendation.findById(id);

    return recommendation;
}

const createRecommendation = async (body) => {
    const recommendation = new Recommendation(body);

    await recommendation.save();

    return recommendation;
}

const getFullUserRecommendations = async (userId, limit) => {
    const recommendations = await Recommendation.find({
        receiver: userId,
        seen: false,
    })
        .populate("sender", "name")
        .populate("book", "title author coverImg description")
        .sort({ date: -1 })
        .limit(limit);

    return recommendations;
};

module.exports = {
    getRecommendationByQuery,
    createRecommendation,
    getFullUserRecommendations,
    getRecommendationById,
}