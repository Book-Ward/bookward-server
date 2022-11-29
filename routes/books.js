const express = require('express');
const router = express.Router()
const {
    getGreatestBooks,
    getBookInfo
} = require("../controllers/booksController")

router.get('/books', getGreatestBooks);
router.get('/book/:bookId', getBookInfo)

module.exports = router;