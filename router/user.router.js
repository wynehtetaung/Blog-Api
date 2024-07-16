const express = require("express");
const router = express.Router();
const User = require("../model/User.model");
const Comment = require("../model/Comment.model");
const Post = require("../model/Post.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const { checkPost } = require("../middleware/checkPost");
const { checkUser } = require("../middleware/checkUser");

router.get("/", async (req, res) => {
   const { id } = req.query;
   if (id) {
      const user = await User.findById(id);
      return res.status(200).json({
         success: true,
         message: "one user",
         resource: user,
      });
   }
   return res.status(200).json({
      success: true,
      message: "Welcome from express server!",
      resource: 0,
   });
});

router.get("/list", async (req, res) => {
   const users = await User.find().sort({ _id: -1 });
   res.status(200).json({
      success: true,
      message: "user list",
      resource: users,
   });
});

router.get("/verify", auth, checkUser, (req, res) => {
   return res.json({ data: res.locals.user });
});

router.get("/comment", async (req, res) => {
   const comments = await Comment.aggregate([
      {
         $lookup: {
            from: "posts",
            localField: "post",
            foreignField: "_id",
            as: "post",
         },
      },
      {
         $unwind: "$post",
      },
   ]);
   return res.status(200).json({
      success: true,
      message: "comments lists",
      resource: comments,
   });
});

router.post("/register", async (req, res) => {
   const { name, email, password, image } = req.body;
   let role;
   const { admin } = req.query;
   if (admin || admin === process.env.ADMIN_KEY) role = "admin";
   else role = "user";
   if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "required!" });
   const hash = await bcrypt.hash(password, 10);
   const user = new User({
      name,
      email,
      password: hash,
      image,
      bookmark: [],
      role,
   });

   user
      .save()
      .then((result) => {
         res.status(201).json({
            success: true,
            message: "user account created!",
            resource: result,
         });
      })
      .catch((err) => {
         res.status(409).json({
            success: true,
            message: "done",
            resource: new Error(err).message,
         });
      });
});

router.post("/login", async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(400).json({
         success: false,
         message: "email & password required!",
      });
   }
   const findUser = await User.findOne({ email });
   if (findUser) {
      const user = {
         _id: findUser._id,
         name: findUser.name,
         email: findUser.email,
         role: findUser.role,
         image: findUser.image,
      };
      if (await bcrypt.compare(password, findUser.password)) {
         const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h",
         });
         return res.status(200).json({
            success: true,
            message: "login success!",
            token: token,
         });
      }
   }
   return res.status(401).json({
      success: false,
      message: "incorrect email & password!",
   });
});

router.put(
   "/:pid/give-rating",
   auth,
   checkPost,
   checkUser,
   async (req, res) => {
      const { pid } = req.params;
      const authUser = res.locals.user.user;
      const { count } = req.body;
      const user = {
         _id: authUser._id,
         name: authUser.name,
         email: authUser.email,
         image: authUser.image,
         role: authUser.role,
      };
      const add_rating = {
         user,
         count,
      };
      const findUser = await User.findById(authUser._id);
      const filterUser = findUser.rating_post.filter(
         (post) => post.postId == pid
      );
      if (filterUser.length === 0) {
         await User.findByIdAndUpdate(authUser._id, {
            $push: { rating_post: { postId: pid } },
         });
         await Post.findByIdAndUpdate(pid, {
            $push: { given_rating: add_rating },
         });
      }

      const { given_rating, total_rating } = await Post.findById(pid);

      if (total_rating === 0) {
         await Post.findByIdAndUpdate(pid, { total_rating: Number(count) });
      } else {
         const get_total_rating = (total_rating / given_rating.length).toFixed(
            1
         );

         await Post.findByIdAndUpdate(pid, {
            total_rating: Number(get_total_rating),
         });
      }
      const post = await Post.findById(pid);
      res.status(200).json({
         success: true,
         message: "given rating",
         resource: post,
      });
   }
);

router.put("/", auth, checkUser, async (req, res) => {
   if (res.locals.user.success === false) {
      return res.status(404).json({
         success: false,
         message: res.locals.user.message,
      });
   }
   const { _id } = res.locals.user.user;
   const { name, password, image, email } = req.body;
   if (name) {
      await User.findByIdAndUpdate(_id, { name });
   } else if (password) {
      const hash = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(_id, { password: hash });
   } else if (image) {
      await User.findByIdAndUpdate(_id, { image });
   } else if (email) {
      await User.findByIdAndUpdate(_id, { email });
   }
   const user = await User.findById(_id);
   res.status(200).json(user);
});

router.put(
   "/:pid/add-bookmark",
   auth,
   checkUser,
   checkPost,
   async (req, res) => {
      const { pid } = req.params;
      const { _id } = res.locals.user.user;
      const user = await User.findById(_id);
      if (user.bookmark.length > 0) {
         if (!user.bookmark.includes(pid)) {
            await User.findByIdAndUpdate(_id, { $push: { bookmark: pid } });
         }
      } else {
         await User.findByIdAndUpdate(_id, { bookmark: pid });
      }
      await Post.findByIdAndUpdate(pid, { $push: { bookmark: _id } });
      const resultUser = await User.findById(_id);
      res.status(200).json({
         success: true,
         message: "add post to bookmark",
         resource: resultUser,
      });
   }
);

router.put(
   "/:pid/remove-bookmark",
   auth,
   checkUser,
   checkPost,
   async (req, res) => {
      const { pid } = req.params;
      const { _id } = res.locals.user.user;
      const user = await User.findById(_id);
      const filterBookmark = user.bookmark.filter((p) => p !== pid);
      await User.findByIdAndUpdate(_id, { bookmark: filterBookmark });
      const post = Post.findById(pid);
      const filterPosts = post.bookmark.filter((p) => p !== _id);
      await Post.findByIdAndUpdate(pid, { bookmark: filterPosts });
      const resultUser = await User.findById(_id);
      res.status(200).json({
         success: true,
         message: "remove post in bookmark",
         resource: resultUser,
      });
   }
);

router.post("/:pid/comment", auth, checkUser, checkPost, async (req, res) => {
   const { pid } = req.params;
   const { user } = res.locals.user;
   const { comment } = req.body;

   new Comment({
      post: pid,
      comment,
      commenter: user,
   })
      .save()
      .then((result) => {
         return res.status(201).json({
            success: true,
            message: "comment created!",
            resource: result,
         });
      })
      .catch((e) => {
         return res.status(500).json({
            success: false,
            message: "comment create fail!",
            error: e,
         });
      });
});

router.delete(
   "/:pid/comment/:cid",
   auth,
   checkPost,
   checkUser,
   async (req, res) => {
      const { pid, cid } = req.params;

      await Comment.findByIdAndDelete(cid);
      res.status(204).json("deleted");
   }
);

router.delete("/:id", auth, checkUser, async (req, res) => {
   if (res.locals.user.success === false) {
      return res.status(404).json({
         success: false,
         message: res.locals.user.message,
      });
   }
   const { id } = req.params;
   await User.findByIdAndDelete(id);
   res.status(204).json("deleted");
});

module.exports = { userRouter: router };
