const recommendationsService = require("../services/recommendations-service")

const sendRecommendation = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;
        const receiverId = req.body?.userId;
        const bookId = req.body?.bookId;
        const message = req.body?.message;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!receiverId || !bookId) {
            res.status(400).json({
                message: "Receiver id and book id are required",
            });
            return;
        }

        const recommendationObj = await recommendationsService.sendRecommendationToUser(user.id, receiverId, bookId, message);

        res.status(200).json({ success: true, data: recommendationObj });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUnseenRecommendations = async (req, res) => {
    const user = res.locals?.data?.data?.user;

    try {
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const recommendations = await recommendationsService.getUnseenRecommendations(user.id);

        res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const acknowledgeRecommendation = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;
        const recommendationId = req.params?.id;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!recommendationId) {
            res.status(400).json({ message: "Recommendation id is required" });
            return;
        }

        const recommendation = await recommendationsService.acknowledgeRecommendation(recommendationId, user.id);
        
        res.status(200).json({ success: true, data: recommendation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendRecommendation,
    getUnseenRecommendations,
    acknowledgeRecommendation,
};
