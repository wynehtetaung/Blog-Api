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
   },
   given_rating: [
      {
         user: Object,
         count: Number,
      },
   ],
   total_rating: {
      type: Number,
      default: 0,
   },
   image: {
      type: Array,
      required: true,
   },
   product_description: {
      type: String,
   },
   shop_description: {
      type: String,
   },
   owner: {
      type: schema.Types.ObjectId,
      ref: "users",
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
