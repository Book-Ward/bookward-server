const Book = require("../models/book");
const User = require("../models/user");
const { getReviewsByBookId } = require("./reviewsService");

const getHighestRatedBooks = async (req, res) => {
    const minNumRatings = 500000;

    try{
        const data = await Book.find( { numRatings: { $gte:  minNumRatings} } )
        .sort({rating: -1})
        .limit(24)
        .select('_id title coverImg genres');

        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

const getPersonalizedBooks = async (req, res) => {
    const minNumRatings = 500000;

    try{
        const data = await Book.find( { numRatings: { $gte:  minNumRatings} } )
        .sort({rating: -1})
        .limit(24)
        .select('_id title coverImg genres');

        const user = await User.findOne( { userId: req.params?.userId?.toString() } );

        if (user) {
            const savedBooks = user.savedBooks;
            data.forEach((book, idx) => {
                if (savedBooks.includes(book._id.toString())) {
                    data[idx] = { ...book._doc, liked: true };
                } else {
                    data[idx] = { ...book._doc, liked: false };
                }
            });
        }

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

const getBookByName = async (req, res) => {
    console.log("Getting book by name for: " + req.body.title.toString());

    try{
        
        const data = await Book.find({title: {'$regex': req.body.title.toString(),$options:'i'}})
        .sort({ numRatings: -1 })
        .limit(10)
        .select('_id title coverImg');

        console.log("Found " + data.length + " mathes for query: " + req.body.title.toString())

        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message: error.message});
    };
}  

module.exports = {
    getGreatestBooks: getHighestRatedBooks,
    getBookInfo: getBookInfo,
    getBookByName: getBookByName,
    getFeaturedBooks: getFeaturedBooks,
    getPersonalizedBooks: getPersonalizedBooks
}

