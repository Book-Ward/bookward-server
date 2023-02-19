const { model, Schema } = require("mongoose");

const recommendationSchema = new Schema({
    book:  {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
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