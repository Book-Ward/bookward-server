const express = require('express');
const router = express.Router()
const {
    getGreatestBooks
} = require("../controllers/booksController")

router.get('/books', getGreatestBooks);

module.exports = router;