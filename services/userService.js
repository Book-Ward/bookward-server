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
        const user = await User.findOne( { userId: req.body.userId.toString() } );

        const book = await Book.findById(req.body.bookId.toString());

        if (!book) {
            res.status(500).json( { success: false, message: "Book not found" } );
        } else {
            if (user.savedBooks.includes(book._id)) {
                res.status(500).json( { success: false, message: "Book already saved" } );
            } else {
                user.savedBooks.push(book._id);

                await user.save();    

                res.status(200).json( { success: true, data: user } )
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
