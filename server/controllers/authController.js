const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.sendOtp = async (req, res) => {
  const { phone, name, referralCode, agree } = req.body;

  if (!agree) {
    return res.status(400).json({
      message: "Please accept Terms & Conditions",
    });
  }

  let user = await User.findOne({ phone });

  const otp = process.env.NODE_ENV === "production"
  ? Math.floor(100000 + Math.random() * 900000).toString()
  : "123456";

  let referredBy = null;

  if (referralCode) {
    const broker = await User.findOne({ referralCode });
    if (broker) referredBy = broker._id;
  }

  if (!user) {
    user = await User.create({
      name,
      phone,
      otp,
      referredBy,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });
  } else {
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
  }

  res.json({
    message: "OTP sent",
    ...(process.env.NODE_ENV !== "production" && { otp })
  });
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (!user.otp) {
    return res.status(400).json({
      message: "OTP not requested",
    });
  }

  user.isVerified = true;
  user.otp = null;

  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successful",
    token,
    user,
  });
};


  const jwt = require("jsonwebtoken");


  exports.applyReferral = async (req, res) => {
    try {
      const { referralCode } = req.body;
  
      const user = await User.findById(req.user.id);
  
      if (user.referredBy) {
        return res.status(400).json({
          message: "Referral already applied",
        });
      }
  
      const broker = await User.findOne({ referralCode });
  
      if (!broker) {
        return res.status(400).json({
          message: "Invalid referral code",
        });
      }
  
      user.referredBy = broker._id;
      await user.save();
  
      res.json({
        message: "Referral applied successfully",
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  exports.resendOtp = async (req, res) => {
    const { phone } = req.body;
  
    const user = await User.findOne({ phone });
  
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
  
    // ⏱ cooldown check (30 sec)
    const now = Date.now();
    if (user.lastOtpSent && now - user.lastOtpSent < 30000) {
      return res.status(400).json({
        message: "Please wait before requesting again",
      });
    }
  
    const otp =
      process.env.NODE_ENV === "production"
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : "123456";
  
    user.otp = otp;
    user.otpExpiry = now + 5 * 60 * 1000;
    user.lastOtpSent = now;
  
    await user.save();
  
    res.json({
      message: "OTP resent successfully",
      ...(process.env.NODE_ENV !== "production" && { otp }),
    });
  };