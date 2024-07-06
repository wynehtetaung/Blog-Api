const Post = require("../model/Post.model");
const checkPost = async (req, res, next) => {
   const { pid, id } = req.params;
   const checkId = pid || id;
   const posts = await Post.find();
   const checkPost = posts.filter((post) => post._id == checkId);
   if (checkPost.length === 0) {
      return res.status(404).json({
         success: false,
         message: "Post not found!",
      });
   }
   next();
};

module.exports = { checkPost };
