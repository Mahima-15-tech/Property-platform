const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,

  role: {
    type: String,
    enum: ["admin", "investor", "broker"],
    default: "investor",
  },

  isVerified: { type: Boolean, default: false },

  otp: String,
  otpExpiry: Date,

  kycDocument: {
    type: String,
  },

  kycStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  isApproved: { type: Boolean, default: false }, // broker approval

  referralCode: String,   // broker ka code
referredBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

commissionRate: {
  type: Number,
  default: 10, // default 10%
}

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);