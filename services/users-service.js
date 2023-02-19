const userRepository = require("../data-access/repositories/user-repository");
const booksService = require("./books-service");

const getFullUserInfo = async (userId) => {
    const user = await userRepository.getFullUserById(userId);

    booksService.populateSavedBooks(user.savedBooks, user);

    return user;
}

const getUser = async (userId) => {
    const user = await userRepository.getUserById(userId);

    return user;
}

const saveBook = async (userId, bookId) => {
    const user = await userRepository.getUserById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const book = await booksService.getBookById(bookId);

    if (!book) {
        throw new Error("Book not found");
    }

    await saveUnsaveBook(user, book);

    return user;
}

const saveUnsaveBook = async (user, book) => {
    if (user.savedBooks.includes(book._id)) {

        user.savedBooks = user.savedBooks.filter(
            (bookId) => bookId.toString() !== book._id.toString()
        );
    }
    else {
        user.savedBooks.push(book._id);
    }

    await user.save();
}

const followUser = async (userId, reqUserId) => {

    const user = await userRepository.getUserById(userId);

    const userToFollow = await userRepository.getUserById(reqUserId);

    if (!userToFollow || !user) {
        throw new Error("User not found");
    }

    if (user._id.toString() === userToFollow._id.toString()) {
        throw new Error("You cannot follow yourself");
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

    return user;
}

const searchForUsers = async (query, user) => {
    const users = await userRepository.searchUsersByUsername(query);

    console.log("Found " + users.length + " matches for query: " + query);

    if (users.length === 0) {
        return users;
    }

    if (user) {
        const searcher = await userRepository.getUserById(user.id);

        populateFollowingUsers(users, searcher)
    }

    return users;
};

const populateFollowingUsers = (users, searcher) => {
    users.forEach((user, idx) => {
        if (searcher.following.includes(user._id)) {
            users[idx] = { ...user._doc, isFollowing: true };
        }
    });
};

const getFollowingByUser = async (userId) => {
    const user = await userRepository.getFullUserById(userId);

    return user.following;
};

module.exports = {
    getFullUserInfo,
    saveBook,
    followUser,
    searchForUsers,
    getFollowingByUser,
    getUser,
};