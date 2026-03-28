const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },

  shares: Number,
  amount: Number,

  status: {
    type: String,
    enum: ["pending", "completed", "rejected"],
    default: "pending",
  },
  method: {
    type: String,
    default: "Bank Transfer",
  },

}, { timestamps: true });

module.exports = mongoose.model("Investment", investmentSchema);