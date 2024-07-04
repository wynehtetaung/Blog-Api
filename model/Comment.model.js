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
      type: Object,
      required: true,
   },
   created: {
      type: Date,
      default: Date.now(),
   },
});

module.exports = mongoose.model("comments", commentSchema);
