const User = require("../models/user");
const bcrypt = require("bcrypt");
const Commission = require("../models/commission");
const Investment = require("../models/investment");

exports.registerBroker = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = process.env.NODE_ENV === "production"
    ? Math.floor(100000 + Math.random() * 900000).toString()
    : "123456";

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,

      role: "broker", // 🔥 yaha broker set hoga
      isApproved: false,
      commissionRate: 10,  // admin approve karega

      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      referralCode: "BRK" + Math.floor(1000 + Math.random() * 9000)
    });

    res.json({
        message: "Broker registered successfully. Please verify OTP and wait for admin approval",
      otp,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBrokerCommission = async (req, res) => {
  const commissions = await Commission.find({
    brokerId: req.user.id,
  }).populate("userId propertyId");

  res.json(commissions);
};

exports.getAllBrokers = async (req, res) => {
  try {
    const COMMISSION_RATE = 10;

    const brokers = await User.find({ role: "broker" });

    const data = await Promise.all(
      brokers.map(async (broker) => {

        // referrals
        const referrals = await User.countDocuments({
          referredBy: broker._id,
        });

        // referred users
        const referredUsers = await User.find({
          referredBy: broker._id,
        }).distinct("_id");

        // investments
        const investments = await Investment.find({
          userId: { $in: referredUsers },
        });

        // commissions
        const commissions = await Commission.find({
          brokerId: broker._id,
        });

        const totalCommission = commissions.reduce(
          (sum, c) => sum + c.commissionAmount,
          0
        );

        return {
          _id: broker._id,
          name: broker.name,
          referrals,
          conversions: investments.length,
          earnings: totalCommission,
          commissionRate: `${broker.commissionRate}%`, // sirf display
          status: broker.isApproved ? "active" : "pending",
        };
      })
    );

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommissionBreakdown = async (req, res) => {
  try {
    const commissions = await Commission.find();

    let sale = 0;
    let referral = 0;
    let performance = 0;

    commissions.forEach((c) => {
      if (c.type === "sale") sale += c.commissionAmount;
      if (c.type === "referral") referral += c.commissionAmount;
      if (c.type === "performance") performance += c.commissionAmount;
    });

    const total = sale + referral + performance;

    res.json({
      total,
      sale,
      referral,
      performance,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET /broker/dashboard
exports.getBrokerDashboard = async (req, res) => {
  try {
    const brokerId = req.user.id;

    // 🟢 1. Total referrals
    const referrals = await User.countDocuments({
      referredBy: brokerId,
    });

    // 🟢 2. Referred users list
    const referredUsers = await User.find({
      referredBy: brokerId,
    }).distinct("_id");

    // 🟢 3. Investments (NO status filter ❗)
    const investments = await Investment.find({
      userId: { $in: referredUsers },
    });

    // 🟢 4. Total Investment (safe fallback)
    const totalInvestment = investments.reduce(
      (sum, inv) => sum + (inv.finalAmount || inv.amount || 0),
      0
    );

    // 🟢 5. Conversions (unique investors count)
    const uniqueInvestors = new Set(
      investments.map((inv) => inv.userId.toString())
    );

    const conversions = uniqueInvestors.size;

    // 🟢 6. Commissions
    const commissions = await Commission.find({
      brokerId,
    });

    let paid = 0;
    let pending = 0;

    commissions.forEach((c) => {
      if (c.status === "paid") {
        paid += c.commissionAmount;
      } else {
        pending += c.commissionAmount;
      }
    });

    // 🟢 7. Final response
    res.json({
      referrals,
      conversions,
      totalInvestment,
      totalEarnings: paid + pending,
      pendingCommission: pending,
      paidCommission: paid,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBrokerProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    name: user.name,
    referralCode: user.referralCode,
    shareLink: `https://yourdomain.com/register?ref=${user.referralCode}`
  });
};

exports.getReferredInvestors = async (req, res) => {
  const brokerId = req.user.id;

  const users = await User.find({ referredBy: brokerId });

  const investments = await Investment.find({
    userId: { $in: users.map(u => u._id) }
  })
  .populate("userId", "name phone")
  .populate("propertyId", "name")
  .sort({ createdAt: -1 });

  const data = investments.map(inv => ({
    investorName: inv.userId.name,
    contact: inv.userId.phone,
    property: inv.propertyId.name,
    amount: inv.finalAmount,
    date: inv.createdAt,
    status: inv.status,
  }));

  res.json(data);
};


exports.getCommissionDetails = async (req, res) => {
  const brokerId = req.user.id;

  const commissions = await Commission.find({ brokerId })
    .populate("userId", "name")
    .populate("propertyId", "name");

  res.json(commissions);
};

exports.getEarningsSummary = async (req, res) => {
  const brokerId = req.user.id;

  const commissions = await Commission.find({ brokerId });

  const monthly = commissions.filter(c => {
    const now = new Date();
    return c.createdAt.getMonth() === now.getMonth();
  });

  const total = monthly.reduce((sum, c) => sum + c.commissionAmount, 0);

  const target = 15000;

  res.json({
    total,
    target,
    percent: (total / target) * 100,
    nextPayout: "30 Oct 2023"
  });
};