  const mongoose = require("mongoose");
  const userSchema = new mongoose.Schema({
    name: String,
  
    email: {
      type: String,
      unique: true,
      sparse: true, // 👈 important (OTP users ke liye)
    },
  
    password: {
      type: String,
      select: false,
    },
  
    phone: {
      type: String,
      required: true,
      unique: true,
    },
  
    role: {
      type: String,
      enum: ["admin", "investor", "broker"],
      default: "investor",
    },
  
    isVerified: { type: Boolean, default: false },
  
    otp: String,
    otpExpiry: Date,
  
    kycDocument: String,
    kycStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  
    lastOtpSent: Date,
    referralCode: String,
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    commissionRate: {
      type: Number,
      default: 10
    },
  
  }, { timestamps: true });

  module.exports = mongoose.model("User", userSchema);