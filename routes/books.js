const express = require('express');
const router = express.Router()
const {
    bookMiddleware,
} = require("../middlewares/middleware");
const supabase_middleware = require('../middlewares/supabaseMiddleware');
const {
    getBookInfo,
    getBookByCriteria,
    getFeaturedBooks,
    getPopularBooks
} = require("../services/booksService")

router.post('/books/:page', supabase_middleware, getPopularBooks);
router.get('/featured/:userId', getFeaturedBooks);
router.get('/book/:bookId', supabase_middleware, getBookInfo);
router.post('/book/search', supabase_middleware, getBookByCriteria);

module.exports = router;