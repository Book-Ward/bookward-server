const { model, Schema } = require("mongoose");

var userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  bio: { type: String, required: false },
  profileImg: { type: String, required: false },
  followers: { type: Array, required: false },
  following: { type: Array, required: false },
  savedBooks: { type: Array, required: false },
  upvotedReviews: { type: Array, required: false },
  reviews: { type: Array, required: false },
  created: { type: Date, default: Date.now },
});

module.exports = model("User", userSchema);
