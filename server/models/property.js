const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    // 🔹 BASIC (UI me name use ho raha hai)
    name: String,
    type: String,
    description: String,

  


    // 🔹 USER
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    size: String, // e.g. "1200 sqft"


    isPublished: {
      type: Boolean,
      default: true,
    },

    // 🔥 INVESTMENT (UI fields)
    totalValue: Number,
    totalShares: Number,
    availableShares: Number,
    pricePerShare: Number,

    roi: Number,
    duration: Number,

    // 🔥 UI CALCULATED
    soldPercent: {
      type: Number,
      default: 0,
    },
    
    progress: {
      type: Number,
      default: 0,
    },
    
    investors: {
      type: Number,
      default: 0,
    },
    
    investedAmount: {
      type: Number,
      default: 0,
    },
    
    status: {
      type: String,
      enum: ["funding", "funded", "active"],
      default: "funding",
    },

    // 🔥 NEW FIELDS ADD
amenities: [String],

media: {
  images: [String],
  video: String,
  brochure: String,
  documents: [String],
},

location: {
  city: String,
  state: String,
  address: String,
  street: String,
  landmark: String,
  pincode: String,
  lat: Number,
  lng: Number,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);