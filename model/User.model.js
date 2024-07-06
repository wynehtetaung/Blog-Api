const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   image: {
      type: String,
   },
   rating_post: [
      {
         postId: {
            type: schema.Types.ObjectId,
            ref: "posts",
         },
      },
   ],
   bookmark: {
      type: Array,
   },
   role: {
      type: String,
      required: true,
   },
});

module.exports = mongoose.model("users", UserSchema);
