require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { userRouter } = require("./router/user.router");
const { postRouter } = require("./router/post.router");
const { campaignRouter } = require("./router/campaign.router");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/campaign", campaignRouter);

mongoose
   .connect(process.env.MONGO_ATLAS_STR)
   .then(() => console.log("Connected mongodb!"))
   .catch((e) => console.log(e));

app.listen(PORT, () => {
   console.log(`Server is running at ${PORT}`);
});
