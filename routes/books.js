const express = require('express');
const router = express.Router()
const {
    getGreatestBooks,
    getBookInfo,
    getBookByName,
    getFeaturedBooks
} = require("../services/booksService")

router.get('/books', getGreatestBooks);
router.get('/books/featured', getFeaturedBooks);
router.get('/book/:bookId', getBookInfo);
router.post('/book/search', getBookByName);

module.exports = router;