const Book = require("../models/book");

const getHighestRatedBooks = async (req, res) => {
    const minNumRatings = 1000000;

    try{
        // Where number of rating are greater or
        // equal and sorting by ascending order
        const data = await Book.find( { numRatings: { $gte:  minNumRatings} } )
        .sort({rating: -1}).limit(10);

        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }};

const getBookInfo = async (req, res) => {
    try{
        const data = await Book.findById(req.params.bookId.toString());

        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message: error.message});
    };
}

module.exports = {
    getGreatestBooks: getHighestRatedBooks,
    getBookInfo: getBookInfo,
}

