const User = require("../models/user");
const AuditLog = require("../models/auditLog");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 check user
    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    // 🔐 password check
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🎟 token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveBroker = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findById(id);
  
      if (!user || user.role !== "broker") {
        return res.status(400).json({ message: "Invalid broker" });
      }
  
      user.isApproved = true;
      await user.save();
  
      res.json({ message: "Broker approved" });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.approveKyc = async (req, res) => {

    


    const { id } = req.params;
  
    const user = await User.findById(id);
  
    user.kycStatus = "approved";
    await user.save();

    await AuditLog.create({
      action: "KYC Approved",
      user: req.user.id,
      details: user.name, // ✅ now correct
      type: "approval",
    });
  
    res.json({ message: "KYC approved" });
  };
  
  exports.rejectKyc = async (req, res) => {
    const { id } = req.params;
  
    const user = await User.findById(id);
  
    user.kycStatus = "rejected";
    await user.save();
  
    res.json({ message: "KYC rejected" });
  };


  const Property = require("../models/property");

