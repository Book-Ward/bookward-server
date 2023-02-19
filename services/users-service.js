const User = require("../data-access/models/user");
const Book = require("../data-access/models/book");
const booksService = require("./books-service");

const getUserInfo = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userObj = await User.findOne({ userId: user.id }).populate(
            "savedBooks reviews following followers"
        );

        booksService.populateSavedBooks(userObj.savedBooks, userObj);

        res.status(200).json(userObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const saveBook = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userObj = await User.findOne({ userId: user.id });

        const book = await Book.findById(req.body.bookId.toString());

        if (!book) {
            res.status(404).json({ success: false, message: "Book not found" });

            return;
        }

        // Unsave book
        if (userObj.savedBooks.includes(book._id)) {
            userObj.savedBooks = userObj.savedBooks.filter(
                (bookId) => bookId.toString() !== book._id.toString()
            );
        }
        // Save book
        else {
            userObj.savedBooks.push(book._id);
        }

        await userObj.save();

        res.status(200).json({ success: true, data: userObj });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const followUser = async (req, res) => {
    const userSupa = res.locals?.data?.data?.user;

    try {
        if (!userSupa) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        
        const user = await User.findOne({ userId: userSupa.id });

        const userToFollow = await User.findOne({
            userId: req.body.userToFollowId.toString(),
        });

        if (!userToFollow) {
            res.status(404).json({ success: false, message: "User not found" });

            return;
        }

        if (user._id.toString() === userToFollow._id.toString()) {
            res.status(405).json({
                success: false,
                message: "You cannot follow yourself",
            });

            return;
        }

        if (user.following.includes(userToFollow._id)) {
            user.following = user.following.filter(
                (userId) => userId.toString() !== userToFollow._id.toString()
            );

            user.followers = user.followers.filter(
                (userId) => userId.toString() !== user._id.toString()
            );
        } else {
            user.following.push(userToFollow._id);

            userToFollow.followers.push(user._id);
        }

        await user.save();

        await userToFollow.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchUsers = async (req, res) => {
    try {
        const users = await User.find({
            name: { $regex: req.params.username, $options: "i" },
        })
            .limit(10)
            .select("name userId");

        console.log("Found " + users.length + " matches for query: " + req.params.username);

        if (res.locals?.data?.data?.user) {
            const { data } = res?.locals?.data;

            const searcher = await User.findOne({ userId: data.user.id });

            users.forEach((user, idx) => {
                if (searcher.following.includes(user._id)) {
                    users[idx] = { ...user._doc, isFollowing: true };
                }
            });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFollowing = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userObj = await User.findOne({ userId: user.id }).populate(
            "following",
            "userId name"
        );

        res.status(200).json({ success: true, data: userObj.following });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserInfo,
    saveBook,
    followUser,
    searchUsers,
    getFollowing,
};
