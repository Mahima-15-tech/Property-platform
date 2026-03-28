const Investment = require("../models/investment");
const Property = require("../models/property");

exports.getPortfolio = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const investments = await Investment.find({ userId })
        .populate("propertyId");
  
      const portfolioMap = {};
  
      investments.forEach((inv) => {
        const property = inv.propertyId;
        const key = property._id.toString();
  
        if (!portfolioMap[key]) {
          portfolioMap[key] = {
            propertyId: property._id,
            title: property.title,
            sharePrice: property.sharePrice,
            roi: property.roi,
  
            totalShares: 0,
            totalInvestment: 0,
            estimatedReturn: 0,
          };
        }
  
        // 🔥 aggregate
        portfolioMap[key].totalShares += inv.shares;
        portfolioMap[key].totalInvestment += inv.amount;
      });
  
      // 🔥 ROI calculation
      Object.values(portfolioMap).forEach((item) => {
        item.estimatedReturn =
          (item.totalInvestment * item.roi) / 100;
      });
  
      res.json(Object.values(portfolioMap));
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };