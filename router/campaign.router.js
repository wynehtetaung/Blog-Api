const router = require("express").Router();
const Campaign = require("../model/Campaign.model");
const Post = require("../model/Post.model");
const { auth } = require("../middleware/auth");
const { checkUser } = require("../middleware/checkUser");
const { admin } = require("../middleware/admin");
const { checkCampaign } = require("../middleware/checkCampign");

router.get("/", async (req, res) => {
   const campaign = await Campaign.find().sort({ _id: -1 });
   res.status(200).json({
      success: true,
      message: "campaign list",
      resource: campaign,
   });
});

router.post("/", auth, checkUser, admin, async (req, res) => {
   const posts = await Post.find();
   const { title, post } = req.body;
   let setPost = [];
   (async () => {
      await post.map((p) => {
         setPost.push(posts.find((post) => post._id == p));
      });
   })();

   new Campaign({
      title,
      products: setPost,
   })
      .save()
      .then((result) => {
         return res.status(201).json({
            success: true,
            message: "campaign created!",
            resource: result,
         });
      })
      .catch((e) => {
         return res.status(500).json({
            success: false,
            message: "campaign create fail!",
            error: e,
         });
      });
});

router.put("/:id", auth, checkUser, admin, async (req, res) => {
   const { id } = req.params;
   const { title, post } = req.body;

   if (title) {
      await Campaign.findByIdAndUpdate(id, { title });
   } else if (post) {
      const posts = await Post.find();
      let setPost = [];
      (async () => {
         await post.map((p) => {
            setPost.push(posts.find((post) => post._id == p));
         });
      })();
      await Campaign.findByIdAndUpdate(id, { products: setPost });
   }

   const campaigns = await Campaign.findById(id);
   res.status(200).json({
      success: true,
      message: "campaign updated",
      resource: campaigns,
   });
});

router.delete(
   "/:id",
   auth,
   checkUser,
   admin,
   checkCampaign,
   async (req, res) => {
      const { id } = req.params;
      await Campaign.findByIdAndDelete(id);
      res.status(204).json("deleted!");
   }
);

module.exports = { campaignRouter: router };
