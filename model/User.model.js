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
   created: {
      type: Date,
      default: Date.now(),
   },
   login_date: {
      type: Date,
      default: Date.now(),
   },
});

module.exports = mongoose.model("users", UserSchema);
