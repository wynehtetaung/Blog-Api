require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { userRouter } = require("./router/user.router");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRouter);

mongoose
   .connect(process.env.MONGO_LOCAL_STR)
   .then(() => console.log("Connected mongodb!"))
   .catch((e) => console.log(e));

app.listen(PORT, () => {
   console.log(`Server is running at ${PORT}`);
});
