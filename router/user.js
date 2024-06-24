const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome from express server!",
    resource: 0,
  });
});

router.post("/", (req, res) => {
  const body = req.body;

  res.status(200).json({
    success: true,
    message: "done",
    resource: body,
  });
});

module.exports = { userRouter: router };
