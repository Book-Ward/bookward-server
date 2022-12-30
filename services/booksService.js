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
        
        let data = [];

        if (req.body?.genres?.length > 0) {
            // get books which match all genres lowercased and title
            data = await Book.find({genres: {'$all': req.body?.genres?.map((genre) => genre.toLowerCase())}, title: {'$regex': req.body?.title?.toString(),$options:'i'}})
            .sort({ numRatings: -1, rating: -1 })
            .limit(25)
            .select('_id title coverImg');
        }
        else {
            data = await Book.find({title: {'$regex': req.body?.title?.toString(),$options:'i'}})
            .sort({ numRatings: -1, rating: -1 })
            .limit(25)
            .select('_id title coverImg');
        }

        console.log("Found " + data.length + " mathes for query: " + req.body?.title?.toString())


        const user = await User.findOne( { userId: req.body?.userId?.toString() } );

        populateSavedBooks(data, user);

        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message: error.message});
    };
}  

function populateSavedBooks(books, user) {
    if (user) {
        const savedBooks = user.savedBooks;
        books.forEach((book, idx) => {
            if (savedBooks.includes(book._id.toString())) {
                books[idx] = { ...book._doc, liked: true };
            } else {
                books[idx] = { ...book._doc, liked: false };
            }
        });
    }
}

module.exports = {
    getBookInfo: getBookInfo,
    getBookByCriteria: getBookByCriteria,
    getFeaturedBooks: getFeaturedBooks,
    getPopularBooks: getPopularBooks
}

