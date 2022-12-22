const { model, Schema } = require("mongoose");

var userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, required: false },
  profileImg: { type: String, required: false },
  followers: [{ 
    type: Schema.Types.ObjectId,
    ref: "User", 
  }],
  following: [{ 
    type: Schema.Types.ObjectId,
    ref: "User", 
  }],
  savedBooks: [{
     type: Schema.Types.ObjectId,
     ref: "Book"
  }],
  upvotedReviews: { type: Array, required: false },
  reviews: [{ 
    type: Schema.Types.ObjectId,
    ref: "Review", 
  }],
  created: { type: Date, default: Date.now },
});

module.exports = model("User", userSchema);
