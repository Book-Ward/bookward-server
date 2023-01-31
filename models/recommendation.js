const { model, Schema } = require("mongoose");

const recommendationSchema = new Schema({
    book:  {
        type: Schema.Types.ObjectId,
        ref: "Book",
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    message: String,
    seen: {
        type: Boolean,
        default: false,
    },
});

module.exports = model("Recommendation", recommendationSchema);