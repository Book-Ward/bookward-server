const booksService = require("../services/books-service");

const getPopularBooks = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;
        const page = req.query?.page?.toString() || 1;
        const skip = (page - 1) * 50;

        const data = await booksService.getHighestRatedBooks(user, skip);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFeaturedBooks = async (req, res) => {
    const user = res.locals?.data?.data?.user;

    try {
        const data = await booksService.getMostVisitedBooks(user);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookInfo = async (req, res) => {
    const user = res.locals?.data?.data?.user;
    const bookId = req.params.bookId.toString();

    try {
        const response = await booksService.getAllBookInfo(bookId, user);

        res.status(200).json({ ...response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookByCriteria = async (req, res) => {
    try {
        const filters = req?.body;
        const user = res.locals?.data?.data?.user;

        if (!filters) {
            res.status(400).json({ message: "No filters provided" });

            return;
        }

        const data = await booksService.getBooksByFilters(filters, user);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBookInfo,
    getBookByCriteria,
    getFeaturedBooks,
    getPopularBooks,
};
