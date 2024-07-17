const mongoose = require("mongoose");
const schema = mongoose.Schema;

const campaignSchema = new schema({
   title: {
      type: String,
      required: true,
   },
   products: {
      type: Array,
   },
   description: {
      type: String,
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

module.exports = mongoose.model("campaigns", campaignSchema);
