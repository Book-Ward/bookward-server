const Book = require("../models/book");
const User = require("../models/user");
const { getReviewsByBookId } = require("./reviewsService");

const getPopularBooks = async (req, res) => {
    const userId = req.body?.userId?.toString() || null;
    const page = req.params?.page?.toString() || 1;
    const skip = (page - 1) * 50;

    try{
        const agg = Book.aggregate([
            {
                $addFields: {
                    combinedScore: {
                        $add: [
                            { $multiply: ["$numRatings", 0.7] },
                            { $multiply: ["$rating", 0.3] }
                        ]
                    }
                }
            },
            {
                $sort: { combinedScore: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: 50
            }
        ]);
        
        const data = await agg.exec();

        if (userId !== null) {
            const user = await User.findOne( { userId: userId } );

            if (user && data) {
                const savedBooks = user.savedBooks;
    
                data.forEach((book, idx) => {
                    if (savedBooks.includes(book._id.toString())) {
                        data[idx] = { ...book, liked: true };
                    } else {
                        data[idx] = { ...book, liked: false };
                    }
                });
            } 
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
        .limit(8)
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

        const similarBooks = await getSimilarBooks(book);

        res.status(200).json({bookInfo: book, reviews: reviews, similarBooks: similarBooks});
    }
    catch(error){
        res.status(500).json({message: error.message});
    };
}

const getSimilarBooks = async (book) => {
    const genresArray = book.genres;
    const author = book.author;
    const title = book.title;

    try{
        const agg = Book.aggregate([
            {
                $match: {
                    genres: { $in: genresArray },
                    title: { $ne: title },
                    numRatings: { $gte: 10000 }
                }
            },
            {
                $addFields: {
                    combinedScore: {
                        $add: [
                            { $multiply: [{ $size: { $setIntersection: ["$genres", genresArray] } }, 0.3] }, 
                            { $multiply: [{ $cond: [{ $eq: ["$author", author] }, 1, 0] }, 0.7] } 
                        ]
                    }
                }
            },
            {
                $sort: {
                    combinedScore: -1,
                    rating: -1
                }
            },
            {
                $limit: 5
            }
        ])
        
        const data = await agg.exec();

        return data;
    }
    catch(error){
        console.log(error);

        return [];
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

