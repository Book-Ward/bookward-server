const express = require('express');
const router = express.Router()
const {
    bookMiddleware,
} = require("../middlewares/middleware")
const {
    getBookInfo,
    getBookByCriteria,
    getFeaturedBooks,
    getPopularBooks
} = require("../services/booksService")

router.get('/books/:userId', getPopularBooks);
router.get('/featured/:userId', getFeaturedBooks);
router.get('/book/:bookId', bookMiddleware, getBookInfo);
router.post('/book/search', getBookByCriteria);

module.exports = router;