const mongoose = require("mongoose");
const schema = mongoose.Schema;

const commentSchema = new schema({
   post: {
      type: schema.Types.ObjectId,
      ref: "posts",
   },
   comment: {
      type: String,
      required: true,
   },
   commenter: {
      type: schema.Types.ObjectId,
      ref: "users",
   },
   created: {
      type: Date,
      default: Date.now(),
   },
});

module.exports = mongoose.model("comments", commentSchema);
