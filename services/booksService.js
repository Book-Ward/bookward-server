const Book = require("../models/book");

const getHighestRatedBooks = async (req, res) => {
    const minNumRatings = 500000;

    try{
        const data = await Book.find( { numRatings: { $gte:  minNumRatings} } )
        .sort({rating: -1})
        .limit(150);

        const filteredData = data.map((datum) => {
            return {
            '_id':datum._id,
            'title':datum.title,
            'coverImg': datum.coverImg
            }
        });;

        res.status(200).json(filteredData);
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

const getBookByName = async (req, res) => {
    try{
        
        const data = await Book.find({title: {'$regex': req.body.title.toString(),$options:'i'}})
        .sort({ numRatings: -1 })
        .limit(10);
        
        // TODO: export to method
       const filteredData = data.map((datum) => {
            return {
            '_id':datum._id,
            'title':datum.title,
            'coverImg': datum.coverImg
            }
        });;

        console.log("Found " + filteredData.length + " mathes for query: " + req.body.title.toString())

        res.status(200).json(filteredData);
    }
    catch(error){
        res.status(500).json({message: error.message});
    };
}  

module.exports = {
    getGreatestBooks: getHighestRatedBooks,
    getBookInfo: getBookInfo,
    getBookByName: getBookByName
}

