const Book = require("../models/book");

const getBookById = async (bookId) => {
    const book = await Book.findById(bookId);

    return book;
};

const getBooksByQuery = async (query, limit) => {
    const data = await Book.find(query)
                .sort({ numRatings: -1, rating: -1 })
                .limit(limit)
                .select("_id title coverImg");

    return data;
};

const getPopularBooksAggregate = async (offset, limit) => {
    // Creates custom score based on rating and number of ratings
    // 70% of the score is based on number of ratings
    // 30% of the score is based on rating
    const agg = Book.aggregate([
        {
            $addFields: {
                combinedScore: {
                    $add: [
                        { $multiply: ["$numRatings", 0.7] },
                        { $multiply: ["$rating", 0.3] },
                    ],
                },
            },
        },
        {
            $sort: { combinedScore: -1 },
        },
        {
            $skip: offset,
        },
        {
            $limit: limit,
        },
    ]);

    const data = await agg.exec();

    return data;
};

const getMostVisitedBooksWtihLimit = async (limit) => {
    const data = await Book.find()
                .sort({ visited: -1, rating: -1 })
                .limit(limit)
                .select("_id title coverImg genres");

    return data;
};

const getSimilarBooksAggregate = async (genres, author, title) => {
    // Creates custom score based on genres and author
    // 70% of the score is based on author
    // 30% of the score is based on genres
    const agg = Book.aggregate([
        {
            $match: {
                genres: { $in: genres },
                title: { $ne: title },
                numRatings: { $gte: 10000 },
            },
        },
        {
            $addFields: {
                combinedScore: {
                    $add: [
                        { $multiply: [{ $size: { $setIntersection: ["$genres", genres] } }, 0.3] }, 
                        { $multiply: [{ $cond: [{ $eq: ["$author", author] }, 1, 0] }, 0.7] } 
                    ]
                }
            }
        },
        {
            $sort: {
                combinedScore: -1,
                rating: -1,
            },
        },
        {
            $limit: 5,
        },
    ]);

    const data = await agg.exec();

    return data;
};

const incrementVisitedBookCounter = async (book) => {
    book.visited += 1;
    
    await book.save();
};

module.exports = {
    getPopularBooksAggregate,
    getMostVisitedBooksWtihLimit,
    getBookById,
    getSimilarBooksAggregate,
    incrementVisitedBookCounter,
    getBooksByQuery,
}