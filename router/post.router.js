const router = require("express").Router();
const Post = require("../model/Post.model");
const Comment = require("../model/Comment.model");
const Carousel = require("../model/Carousel.model");
const { auth } = require("../middleware/auth");
const { checkPost } = require("../middleware/checkPost");
const { checkUser } = require("../middleware/checkUser");
const { admin } = require("../middleware/admin");

router.get("/", async (req, res) => {
   const posts = await Post.aggregate([
      {
         $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
         },
      },
      {
         $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "post",
            as: "comment",
         },
      },

      { $unwind: "$owner" },
      { $sort: { _id: -1 } },
   ]);

   res.status(200).json({
      success: true,
      message: "post list",
      resource: posts,
   });
});

router.get("/:id", checkPost, async (req, res) => {
   const { id } = req.params;
   const post = await Post.findById(id);
   res.status(200).json({
      success: true,
      message: "post",
      resource: post,
   });
});

router.get("/carousel/list", async (req, res) => {
   const carousels = await Carousel.find().sort({ _id: -1 });
   res.status(200).json({
      success: true,
      message: "carousel list",
      resource: carousels,
   });
});

router.post("/", auth, checkUser, async (req, res) => {
   const {
      title,
      address,
      phone,
      category,
      open_hour,
      close_hour,
      image,
      product_description,
      shop_description,
   } = req.body;
   if (res.locals.user.success === false) {
      return res.status(404).json({
         success: false,
         message: res.locals.user.message,
      });
   }
   const { _id } = res.locals.user.user;
   new Post({
      title,
      address,
      phone,
      category,
      open_hour,
      close_hour,
      image,
      product_description,
      shop_description,
      owner: _id,
   })
      .save()
      .then((result) => {
         return res.status(201).json({
            success: true,
            message: "post created!",
            resource: result,
         });
      })
      .catch((e) => {
         return res.status(500).json({
            success: false,
            message: "post create fail!",
            error: e,
         });
      });
});

router.post("/carousel", auth, checkUser, admin, async (req, res) => {
   const { title, image, pid } = req.body;
   new Carousel({
      title,
      image,
      pid,
   })
      .save()
      .then((result) => {
         return res.status(201).json({
            success: true,
            message: "carousel created",
            resource: result,
         });
      })
      .catch((e) => {
         res.status(500).json({
            success: false,
            message: "carousel create fail!",
            error: e,
         });
      });
});

router.put("/:id", auth, checkPost, checkUser, async (req, res) => {
   const { id } = req.params;
   const {
      title,
      address,
      phone,
      category,
      open_hour,
      close_hour,
      image,
      review,
      product_description,
      shop_description,
   } = req.body;

   if (res.locals.user.success === false) {
      return res.status(404).json({
         success: false,
         message: res.locals.user.message,
      });
   }
   await Post.findByIdAndUpdate(id, {
      title,
      address,
      phone,
      category,
      open_hour,
      close_hour,
      image,
      review,
      product_description,
      shop_description,
      updated: Date.now(),
   });

   const post = await Post.findById(id);
   res.status(200).json({
      success: true,
      message: "post updated!",
      resource: post,
   });
});

router.delete("/:id", auth, checkUser, checkPost, async (req, res) => {
   const { id } = req.params;
   if (res.locals.user.success === false) {
      return res.status(404).json({
         success: false,
         message: res.locals.user.message,
      });
   }

   const comment = await Comment.find();
   const filterComment = comment.filter((pid) => pid.post == id);
   filterComment.map(async (fc) => {
      await Comment.findByIdAndDelete(fc._id);
   });
   await Post.findByIdAndDelete(id);
   res.status(204).json("deleted");
});

router.delete("/carousel/:id", auth, checkUser, admin, async (req, res) => {
   const { id } = req.params;
   await Carousel.findByIdAndDelete(id);
   res.status(204).json("deleted");
});

module.exports = { postRouter: router };
