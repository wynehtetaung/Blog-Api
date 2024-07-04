const router = require("express").Router();
const Post = require("../model/Post.model");
const { auth } = require("../middleware/auth");

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

router.get("/:id", async (req, res) => {
   const { id } = req.params;
   const post = await Post.findById(id);
   res.status(200).json({
      success: true,
      message: "post",
      resource: post,
   });
});

router.post("/", auth, async (req, res) => {
   const {
      title,
      address,
      phone,
      open_hour,
      close_hour,
      rating,
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
      open_hour,
      close_hour,
      rating,
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

router.put("/:id", auth, async (req, res) => {
   const { id } = req.params;
   const {
      title,
      address,
      phone,
      open_hour,
      close_hour,
      rating,
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
      open_hour,
      close_hour,
      rating,
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

router.delete("/:id", auth, async (req, res) => {
   const { id } = req.params;
   if (res.locals.user.success === false) {
      return res.status(404).json({
         success: false,
         message: res.locals.user.message,
      });
   }
   await Post.findByIdAndDelete(id);
   res.status(204).json("deleted");
});

module.exports = { postRouter: router };
