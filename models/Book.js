const { model, Schema } = require("mongoose");

const bookSchema = new Schema({
  bookId: String,
  title: String,
  author: String,
  rating: Number,
  description: {
    type: String,
    default: "",
  },
  visited: {
    type: Number,
    default: 0,
  },
  language: String,
  isbn: String,
  genres: Array,
  characters: {
    type: Array,
    default: [],
  },
  bookFormat: {
    type: String,
    default: "",
  },
  edition: {
    type: String,
    default: "",
  },
  pages: {
    type: Number,
    default: 0,
  },
  publisher: {
    type: String,
    default: "",
  },
  publishDate: {
    type: Date,
    default: Date.now(),
  },
  awards: {
    type: Array,
    default: [],
  },
  numRatings: {
    type: Number,
    default: 0,
  },
  ratingsByStars: {
    type: Array,
    default: [],
  },
  likedPercent: {
    type: Number,
    default: 0,
  },
  setting: {
    type: Array,
    default: [],
  },
  coverImg: {
    type: String,
    default: "",
  },
  bbeScore: {
    type: Number,
    default: 0,
  },
  bbeVotes: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Book", bookSchema);
