const express = require("express");
const router = express.Router();
const User = require("../model/User.model");

router.get("/", (req, res) => {
   res.status(200).json({
      success: true,
      message: "Welcome from express server!",
      resource: 0,
   });
});

router.post("/", (req, res) => {
   const { name, email, password } = req.body;
   const user = new User({
      name,
      email,
   });

   user
      .save()
      .then((result) => {
         res.status(201).json({
            success: true,
            message: "done",
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

module.exports = { userRouter: router };
