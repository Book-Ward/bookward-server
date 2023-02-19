const User = require("../models/user");

const getUserById = async (userId) => {
    const user = await User.findOne({ userId: userId });

    return user;
};

module.exports = {
    getUserById,
};