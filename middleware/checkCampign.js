const Campaign = require("../model/Campaign.model");

const checkCampaign = async (req, res, next) => {
   const { cid, id } = req.params;
   const checkId = cid || id;
   const campaign = await Campaign.find();
   const checkCampaign = campaign.filter((camp) => camp._id == checkId);
   if (checkCampaign.length === 0) {
      return res.status(404).json({
         success: false,
         message: "Campaign not found!",
      });
   }
   next();
};
module.exports = { checkCampaign };
