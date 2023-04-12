const booksRepository = require("../data-access/repositories/book-repository");
const { getUserById } = require("../data-access/repositories/user-repository");
const { getReviewsForBook } = require("./reviews-service");
const axios = require("axios");

const getBookById = async (bookId) => {
    const book = await booksRepository.getBookById(bookId);

    return book;
};

const getHighestRatedBooks = async (user, skip) => {
    const data = await booksRepository.getPopularBooksAggregate(skip, 50);

    if (user) {
        const userObj = await getUserById(user.id);

        populateSavedBooksAggregate(data, userObj);
    }

    return data;
}

const getMostVisitedBooks = async (user) => {
    const data = await booksRepository.getMostVisitedBooksWtihLimit(8);

    if (user) {
        const userObj = await getUserById(user.id);

        populateSavedBooks(data, userObj);
    }

    return data;
};

const getAllBookInfo = async (bookId, user) => {
    const book = await booksRepository.getBookById(bookId);

    const reviews = await getReviewsForBook(bookId);

    const similarBooks = await getSimilarBooks(book);

    const keyPhrases = reviews.length > 2 ? await getKeyPhrases(reviews) : [];

    let saved = false;

    if (user) {
        const userObj = await getUserById(user.id);

        saved = userObj.savedBooks.includes(book._id);

        populateSavedBooksAggregate(similarBooks, userObj);
    }

    incrementVisited(book);

    return {
        bookInfo: book,
        reviews,
        similarBooks,
        saved,
        keyPhrases, 
    }
};

const getSimilarBooks = async (book) => {
    const genresArray = book.genres;
    const author = book.author;
    const title = book.title;

    try {
        const data = await booksRepository.getSimilarBooksAggregate(genresArray, author, title);

        return data;
    } catch (error) {
        console.log(error);

        return [];
    }
};

const getKeyPhrases = async (reviews) => {
    const reviewsList = reviews.map((review) => review.content);

    const options = {
        method: "post",
        url: process.env.PY_ENGINE_URL + "/key-phrases/extract",
        headers: { "Content-Type": "application/json" },
        data: { text: reviewsList.join(" ").toString() },
        timeout: 2000,
    };

    return axios(options)
        .then((response) => {
            console.log(response.data);

            return response.data.phrases;
        })
        .catch((error) => {
            if (error.response) {
                console.error(
                    `Error: ${error.response.status} ${error.response.data}`
                );
            } else if (error.request) {
                console.error("Error from py-engine: No response received");
            } else {
                console.error(`Error from py-engine: ${error.message}`);
            }

            return [];
        });
};

const incrementVisited = async (book) => {
    try {
        await booksRepository.incrementVisitedBookCounter(book);
    } catch (error) {
        console.log(error.message);
    }
};

const getBooksByFilters = async (filters, user) => {
    const content = filters.title?.toString().trim();

    const query = await defineSearchQuery(content);

    if (filters.genres?.length > 0) {
        query.genres = {
            $all: filters.genres.map((genre) => genre.toLowerCase()),
        };
    }

    if (filters?.from) {
        query.publishDate = { $gte: new Date(filters.from, 0, 1) };
    }

    if (filters?.to) {
        query.publishDate = {
            ...query.publishDate,
            $lte: new Date(filters.to, 11, 31),
        };
    }

    if (filters?.rating) {
        const ratingNumber = Number(filters.rating);

        query.rating = { $gte: ratingNumber };
    }

    const data = await booksRepository.getBooksByQuery(query, 50);

    console.log("Found " + data.length + " mathes for query: " + filters.title?.toString());

    if (user) {
        const userObj = await getUserById(user.id);

        populateSavedBooks(data, userObj);
    }

    return data;
};

const defineSearchQuery = async (content) => {

    const authorBooks = await booksRepository.getBooksByQuery({
        author: content,
    });

    if (authorBooks.length > 0) {
        console.log("Author query");

        return {
            author: content,
        };
    }

    return {
        title: {
            $regex: content,
            $options: "i",
        },
    };

};

// Add liked status to every book
// Depending on if the user has saved it
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
};

// Add liked status to every book
// Depending on if the user has saved it
const populateSavedBooksAggregate = (books, user) => {
    if (user && books) {
        const savedBooks = user.savedBooks;
        books.forEach((book, idx) => {
            if (savedBooks.includes(book._id.toString())) {
                books[idx] = { ...book, liked: true };
            } else {
                books[idx] = { ...book, liked: false };
            }
        });
    } else {
        console.error("Error populating saved books: aggregate");
    }
};

module.exports = {
    getHighestRatedBooks,
    getMostVisitedBooks,
    getAllBookInfo,
    getBooksByFilters,
    populateSavedBooks,
    populateSavedBooksAggregate,
    getBookById,
};
