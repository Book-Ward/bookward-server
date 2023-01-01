const Book = require("../models/book");
const User = require("../models/user");
const { getReviewsByBookId } = require("./reviewsService");

const minNumRatings = 500000;

const getPopularBooks = async (req, res) => {

    try{
        const data = await Book.find( { numRatings: { $gte:  minNumRatings} } )
        .sort({rating: -1})
        .limit(50)
        .select('_id title coverImg genres');

        const user = await User.findOne( { userId: req.params?.userId?.toString() } );

        populateSavedBooks(data, user);

        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

const getFeaturedBooks = async (req, res) => {
    try{
        const data = await Book.find()
        .sort( { visited: -1, rating: -1 } )
        .limit(3)
        .select('_id title coverImg genres');

        const user = await User.findOne( { userId: req.params?.userId?.toString() } );

        populateSavedBooks(data, user);

        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

const getBookInfo = async (req, res) => {
    console.log("Getting book info for: " + req.params.bookId.toString());

    try{
        const book = await Book.findById(req.params.bookId.toString());

        const reviews = await getReviewsByBookId(req.params.bookId.toString());

        book.visited += 1;
        await book.save();

        res.status(200).json({bookInfo: book, reviews: reviews});
    }
    catch(error){
        res.status(500).json({message: error.message});
    };
}

const getBookByCriteria = async (req, res) => {
    try{
        console.log(req.body)
        
        const query = {
            title: { '$regex': req.body?.title?.toString().trim(), $options: 'i' }
        };
        
        if (req.body?.genres?.length > 0) {
            query.genres = { '$all': req.body.genres.map((genre) => genre.toLowerCase()) };
        }

        if (req.body?.from) {
            query.publishDate = { '$gte': new Date(req.body.from, 0, 1) };
        }
        
        if (req.body?.to) {
            query.publishDate = { ...query.publishDate, '$lte': new Date(req.body.to, 11, 31) };
        }

        if (req.body?.rating)  {
            const ratingNumber = Number(req.body.rating);

            query.rating = { '$gte': ratingNumber };
        }

        const data = await Book.find(query)
                                .sort({ numRatings: -1, rating: -1 })
                                .limit(25)
                                .select('_id title coverImg');

        console.log("Found " + data.length + " mathes for query: " + req.body?.title?.toString())

        const user = await User.findOne( { userId: req.body?.userId?.toString() } );

        populateSavedBooks(data, user);

        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message: error.message});
    };
}  

const populateSavedBooks = (books, user) => {
    if (user && books) {
        const savedBooks = user.savedBooks;
        books.forEach((book, idx) => {
            if (savedBooks.includes(book._id.toString())) {
                books[idx] = { ...book._doc, liked: true };
            } else {
                books[idx] = { ...book._doc, liked: false };
            }
        });
    } else {
        console.error("Error populating saved books");
    }
}

module.exports = {
    getBookInfo: getBookInfo,
    getBookByCriteria: getBookByCriteria,
    getFeaturedBooks: getFeaturedBooks,
    getPopularBooks: getPopularBooks,
    populateSavedBooks: populateSavedBooks
}

