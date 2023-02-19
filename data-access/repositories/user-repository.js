const User = require("../models/user");

const getUserById = async (userId) => {
    const user = await User.findOne({ userId: userId });

    return user;
};

const getFullUserById = async (userId) => {
    const user = await User.findOne({ userId: userId }).populate(
        "savedBooks reviews following followers"
    );

    return user;
};

const searchUsersByUsername = async (username) => {
    const users = await User.find({
        name: { $regex: username, $options: "i" },
    })
        .limit(10)
        .select("name userId");

    return users;
};

module.exports = {
    getUserById,
    getFullUserById,
    searchUsersByUsername,
};
