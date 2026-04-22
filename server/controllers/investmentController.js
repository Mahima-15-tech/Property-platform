const Investment = require("../models/investment");
const Property = require("../models/property");
const User = require("../models/user");
const Commission = require("../models/commission");
exports.invest = async (req, res) => {
  try {

    
    const { propertyId, shares, method } = req.body;

    const user = await User.findById(req.user.id);
    const property = await Property.findById(propertyId);

    const sharesNum = Number(shares);

    if (!sharesNum || isNaN(sharesNum)) {
      return res.status(400).json({
        message: "Invalid shares value",
      });
    }

    if (!property || !property.pricePerShare) {
      return res.status(400).json({
        message: "Property price missing",
      });
    }

    if (user.kycStatus !== "approved") {
      return res.status(403).json({
        message: "Complete KYC first",
      });
    }

    if (sharesNum > property.availableShares) {
      return res.status(400).json({
        message: "Not enough shares available",
      });
    }
    const amount = sharesNum * property.pricePerShare;

    const investment = await Investment.create({
      userId: user._id,
      propertyId,
      shares: sharesNum,
      amount,
      method: method || "Bank Transfer",
  status: "pending", // 🔥 default
    });

    property.availableShares -= sharesNum;
    await property.save();

    // commission
    if (user.referredBy) {
      const broker = await User.findById(user.referredBy);
    
      const totalCommission =
        (amount * broker.commissionRate) / 100;
    
      // 🔥 split logic
      const sale = totalCommission * 0.7;
      const referral = totalCommission * 0.2;
      const performance = totalCommission * 0.1;
    
      await Commission.insertMany([
        {
          brokerId: broker._id,
          userId: user._id,
          propertyId,
          amount,
          commissionAmount: sale,
          type: "sale",
        },
        {
          brokerId: broker._id,
          userId: user._id,
          propertyId,
          amount,
          commissionAmount: referral,
          type: "referral",
        },
        {
          brokerId: broker._id,
          userId: user._id,
          propertyId,
          amount,
          commissionAmount: performance,
          type: "performance",
        },
      ]);
    }

    res.json({
      message: "Investment successful",
      investment,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};  


exports.getCheckoutData = async (req, res) => {
  try {
    const p = await Property.findById(req.params.propertyId);

    res.json({
      id: p._id,
      name: p.name,
      location: p.location?.city,
      image: p.media?.images?.[0],

      sharePrice: p.pricePerShare,
      totalShares: p.totalShares,
      availableShares: p.availableShares,

      roi: p.roi,
      fundedPercent: p.soldPercent,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createInvestment = async (req, res) => {
  try {
    const { propertyId, shares, referralCode } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (shares > property.availableShares) {
      return res.status(400).json({
        message: "Not enough shares available",
      });
    }

    const amount = shares * property.pricePerShare;

    // 🔥 referral logic
    let discount = 0;
    if (referralCode === "SOVEREIGN2024") {
      discount = 500;
    }

    const finalAmount = amount - discount;

    const ownershipPercent =
      (shares / property.totalShares) * 100;

    const investment = await Investment.create({
      userId: req.user.id,
      propertyId,
      shares,
      pricePerShare: property.pricePerShare,
      amount,
      discount,
      finalAmount,
      ownershipPercent,
    });

    // 🔥 PROPERTY UPDATE
    property.availableShares -= shares;
    property.investedAmount += finalAmount;
    property.investors += 1;

    property.soldPercent =
      ((property.totalShares - property.availableShares) /
        property.totalShares) *
      100;

    await property.save();

    res.json({
      message: "Investment successful",
      investment,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

