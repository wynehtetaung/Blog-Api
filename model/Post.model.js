const mongoose = require("mongoose");
const schema = mongoose.Schema;

const postSchema = new schema({
   title: {
      type: String,
      required: true,
   },
   address: {
      type: String,
      required: true,
   },
   phone: {
      type: String,
      required: true,
   },
   open_hour: {
      type: String,
      required: true,
   },
   close_hour: {
      type: String,
      required: true,
   },
   rating: {
      type: Number,
   },
   image: {
      type: Array,
      required: true,
   },
   review: {
      type: String,
   },
   product_description: {
      type: String,
      required: true,
   },
   owner: {
      type: schema.Types.ObjectId,
      ref: "users",
   },
   shop_description: {
      type: String,
      required: true,
   },
   created: {
      type: Date,
      default: Date.now(),
   },
   updated: {
      type: Date,
      default: Date.now(),
   },
});
module.exports = mongoose.model("posts", postSchema);
