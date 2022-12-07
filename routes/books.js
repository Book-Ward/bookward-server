const express = require('express');
const router = express.Router()
const {
    getGreatestBooks,
    getBookInfo,
    getBookByName
} = require("../services/booksService")

router.get('/books', getGreatestBooks);
router.get('/book/:bookId', getBookInfo);
router.post('/book/search', getBookByName)

module.exports = router;