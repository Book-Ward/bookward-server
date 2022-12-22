const User = require("../models/user");
const Book = require("../models/book");

const getUserInfo = async (req, res) => {
    try {
        const userId = req.params.userId.toString();

        const user = await User.find( { userId: userId } );

        if (!user.length) {
            const email = req.body.email.toString();

            const newUser = await User.create( { userId: userId, email: email } );

            res.status(200).json(newUser);

        } else {
            res.status(200).json(user);
        }
    }
    catch(error) {
        res.status(500).json( { message: error.message } );
    };
}

const saveBook = async (req, res) => {
    try {
        const user = await User.find( { userId: req.body.userId.toString() } );

        if (!user.length) {
            res.status(500).json( { message: "User not found" } );
        } else {
            const book = await Book.findById(req.body.bookId.toString());

            if (!book) {
                res.status(500).json( { message: "Book not found" } );
            } else {
                user.savedBooks.push(book);
    
                await user.save();
    
                res.status(200).json(user);
            }
        }
    }
    catch(error) {
        res.status(500).json( { message: error.message } );
    };
}

module.exports = {
    getUserInfo: getUserInfo,
    saveBook: saveBook
}
