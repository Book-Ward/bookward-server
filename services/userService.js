const User = require("../models/user");

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

module.exports = {
    getUserInfo: getUserInfo
}
