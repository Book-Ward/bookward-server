const User = require("../models/user");
const Book = require("../models/book");
const booksService = require("./booksService");
const supabase_middleware = require("../middlewares/supabase-middleware");

const getUserInfo = async (req, res) => {
    try {
        const userId = req.params.userId.toString();

        const user = await User.findOne( { userId: userId } )
                               .populate("savedBooks reviews");

        // TODO: It is not working
        booksService.populateSavedBooks(user.savedBooks, user);

        res.status(200).json(user);
        
    }
    catch(error) {
        res.status(500).json( { message: error.message } );
    };
}

const saveBook = async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findOne( { userId: req.body.userId.toString() } );

        const book = await Book.findById(req.body.bookId.toString());

        if (!book) {
            res.status(500).json( { success: false, message: "Book not found" } );
        } else {
            if (user.savedBooks.includes(book._id)) {

                user.savedBooks = user.savedBooks.filter((bookId) => bookId.toString() !== book._id.toString());

                await user.save();

                res.status(200).json( { success: true, data: user } )
            } else {
                if (req.body.liked) {
                    user.savedBooks.push(book._id);
                }

                await user.save();    

                res.status(200).json( { success: true, data: user } )
            }
        }
    }
    catch(error) {
        res.status(500).json( { message: error.message } );
    };
}

const followUser = async (req, res) => {
    try {
        const user = await User.findOne( { userId: req.body.userId.toString() } );

        const userToFollow = await User.findOne( { userId: req.body.userToFollowId.toString() } );
        // const userToFollow = await User.findById(req.body.userToFollowId.toString());

        if (!userToFollow) {
            res.status(404).json( { success: false, message: "User not found" } );

            return;
        }

        if (user._id.toString() === userToFollow._id.toString()) {
            res.status(405).json( { success: false, message: "You cannot follow yourself" } );

            return;
        }

        if (user.following.includes(userToFollow._id)) {
            user.following = user.following.filter((userId) => userId.toString() !== userToFollow._id.toString());

            user.followers = user.followers.filter((userId) => userId.toString() !== user._id.toString());
        }
        else {
            user.following.push(userToFollow._id);

            userToFollow.followers.push(user._id);
        }

        await user.save();

        await userToFollow.save();

        res.status(200).json( { success: true, data: user } )
    }
    catch(error) {
        res.status(500).json( { message: error.message } );
    };
}

const searchUsers = async (req, res) => {
    try {

        const users = await User.find( { name: { $regex: req.params.username, $options: "i" } } )
        .limit(10)
        .select("name userId");

        console.log("Found " + users.length + " matches for query: " + req.params.username);
        
        // const { data, error } = await supabase_middleware(req);

        if (res.locals?.data?.data?.user) {
            const { data } = res?.locals?.data

            const searcher = await User.findOne( { userId: data.user.id } );

            users.forEach((user, idx) => {
                if (searcher.following.includes(user._id)) {
                    users[idx] = { ...user._doc, isFollowing: true }
                }
            });
        }

        res.status(200).json(users);
    }
    catch(error) {
        res.status(500).json( { message: error.message } );
    };
}

module.exports = {
    getUserInfo: getUserInfo,
    saveBook: saveBook,
    followUser: followUser,
    searchUsers: searchUsers
}
