const User = require("../model/User.model");

const checkUser = async (req, res, next) => {
   const users = await User.find();
   const { user } = res.locals.user;
   const checkUsers = users.filter((user) => user._id == user._id);
   if (checkUsers.length === 0) {
      return res.status(404).json({
         success: false,
         message: "User not found!",
      });
   }
   next();
};

module.exports = { checkUser };
