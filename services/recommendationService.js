const Recommendation = require("../models/recommendation");
const User = require("../models/user");

const sendRecommendation = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!req.body) {
            res.status(400).json({ message: "Request body is required" });
            return;
        }

        if (!req.params.id) {
            res.status(400).json({ message: "Receiver id is required" });
            return;
        }

        if (!req.body.bookId) {
            res.status(400).json({ message: "Book id is required" });
            return;
        }

        const sender = await User.findOne({ userId: user.id });
        const receiver = await User.findById(req.params.id);

        if (sender._id.toString() === receiver._id.toString()) {
            res.status(400).json({
                message: "You can't recommend a book to yourself",
            });
            return;
        }

        const sameReview = await Recommendation.findOne({
            book: req.body.bookId,
            sender: sender._id,
            receiver: receiver._id,
        });

        if (sameReview) {
            res.status(400).json({
                message: "You have already recommended this book to this user",
            });
            return;
        }

        const recommendation = new Recommendation({
            book: req.body.bookId,
            sender: sender._id,
            receiver: receiver._id,
            message: req.body.message,
        });

        await recommendation.save();

        res.status(200).json({ success: true, data: recommendation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUnseenRecommendations = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const receiver = await User.findOne({ userId: user.id });

        if (!receiver) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        const recommendations = await Recommendation.find({
            receiver: receiver._id,
            seen: false,
        })
            .populate("sender", "name")
            .populate("book", "title author coverImg description")
            .sort({ date: -1 })
            .limit(10);

        res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const acknowledgeRecommendation = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!req.params.id) {
            res.status(400).json({ message: "Recommendation id is required" });
            return;
        }

        const recommendation = await Recommendation.findById(req.params.id);

        if (!recommendation) {
            res.status(400).json({ message: "Recommendation not found" });
            return;
        }

        const userObj = await User.findOne({ userId: user.id });
        if (recommendation.receiver.toString() !== userObj._id.toString()) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        recommendation.seen = true;
        await recommendation.save();

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
