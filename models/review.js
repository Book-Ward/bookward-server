const { model, Schema } = require("mongoose");

const reviewSchema = new Schema({
    bookId: {
        type: Schema.Types.ObjectId,
        ref: "Book",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    author: String,
    rating: Number,
    content: String,
    date: {
        type: Date,
        default: Date.now(),
    },
    helpful: {
        type: Number,
        default: 0,
    }
});

module.exports = model("Review", reviewSchema);
