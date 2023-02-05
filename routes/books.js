const express = require('express');
const router = express.Router()
const {
    bookMiddleware,
} = require("../middlewares/middleware");
const supabase_middleware = require('../middlewares/supabase-middleware');
const {
    getBookInfo,
    getBookByCriteria,
    getFeaturedBooks,
    getPopularBooks
} = require("../services/booksService")

router.post('/books/:page', getPopularBooks);
router.get('/featured/:userId', getFeaturedBooks);
// add bookMiddleware 
router.get('/book/:bookId', supabase_middleware, getBookInfo);
router.post('/book/search', getBookByCriteria);

module.exports = router;