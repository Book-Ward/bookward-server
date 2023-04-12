const userService = require("../services/users-service")

const getUserInfo = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userObj = await userService.getFullUserInfo(user.id);

        res.status(200).json(userObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserInfoById = async (req, res) => {
    try {
        const userId = req.params?.userId?.toString();

        const userObj = await userService.getFullUserInfo(userId);

        res.status(200).json(userObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const saveBook = async (req, res) => {
    try {
        const user = res.locals?.data?.data?.user;
        const bookId = req.params?.bookId?.toString();

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userObj = await userService.saveBook(user.id, bookId);

        res.status(200).json({ success: true, data: userObj });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const data = {
            userId: req.body?.userId?.toString(),
            email: req.body?.email?.toString(),
            name: req.body?.username?.toString(),
        }

        await userService.saveUser(data);

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const followUser = async (req, res) => {
    const user = res.locals?.data?.data?.user;
    const userToFollowId = req.body?.userToFollowId?.toString();

    try {
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        
        const userObj = await userService.followUser(user.id, userToFollowId);

        res.status(200).json({ success: true, data: userObj });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchUsers = async (req, res) => {
    const user = res.locals?.data?.data?.user;
    const username = req.query.username?.toString();

    try {
        const users = await userService.searchForUsers(username, user);

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

        const followingUsers = await userService.getFollowingByUser(user.id);

        res.status(200).json({ success: true, data: followingUsers });
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
    createUser,
    getUserInfoById
};
