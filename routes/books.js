const express = require('express');
const router = express.Router()
const supabase_middleware = require('../middlewares/authentication-middleware');
const booksController = require("../controllers/books-controller");

router.post('/books/:page', supabase_middleware, booksController.getPopularBooks);
router.get('/featured', supabase_middleware, booksController.getFeaturedBooks);
router.get('/book/:bookId', supabase_middleware, booksController.getBookInfo);
router.post('/book/search', supabase_middleware, booksController.getBookByCriteria);

module.exports = router;