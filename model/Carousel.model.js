const mongoose = require("mongoose");
const schema = mongoose.Schema;

const carouselSchema = new schema({
   title: {
      type: String,
      required: true,
   },
   image: {
      type: String,
      required: true,
   },
   pid: {
      type: schema.Types.ObjectId,
      ref: "posts",
   },
});

module.exports = mongoose.model("carousels", carouselSchema);
