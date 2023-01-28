const { model, Schema } = require("mongoose");

var userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: false },
  name: { type: String, required: true, unique: false },
  bio: { type: String, required: false },
  profileImg: { type: String, required: false },
  followers: [{ 
    type: Schema.Types.ObjectId,
    ref: "User", 
    default: []
  }],
  following: [{ 
    type: Schema.Types.ObjectId,
    ref: "User", 
    default: []
  }],
  savedBooks: [{
     type: Schema.Types.ObjectId,
     ref: "Book",
     default: []
  }],
  upvotedReviews: { type: Array, required: false },
  reviews: [{ 
    type: Schema.Types.ObjectId,
    ref: "Review", 
    default: []
  }],
  created: { type: Date, default: Date.now },
});

module.exports = model("User", userSchema);
