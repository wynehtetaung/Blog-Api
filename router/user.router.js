const express = require("express");
const router = express.Router();
const User = require("../model/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");

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

router.get("/verify", auth, (req, res) => {
   return res.json(res.locals.user);
});

router.post("/register", async (req, res) => {
   const { name, email, password, role, image } = req.body;
   if (!name || !email || !password || !role)
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
   const user = await User.findOne({ email });
   if (user) {
      if (await bcrypt.compare(password, user.password)) {
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

router.put("/", auth, async (req, res) => {
   if (res.locals.user.success === false) {
      return res.status(404).json({
         success: false,
         message: res.locals.user.message,
      });
   }
   const { _id } = res.locals.user.user;
   const { name, password, image, email, bookmark } = req.body;
   if (name) {
      await User.findByIdAndUpdate(_id, { name });
   } else if (password) {
      const hash = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(_id, { password: hash });
   } else if (image) {
      await User.findByIdAndUpdate(_id, { image });
   } else if (email) {
      await User.findByIdAndUpdate(_id, { email });
   } else if (bookmark) {
      await User.findByIdAndUpdate(_id, { bookmark });
   }
   const user = await User.findById(_id);
   res.status(200).json(user);
});

router.delete("/:id", auth, async (req, res) => {
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
