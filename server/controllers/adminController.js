const User = require("../models/user");
const AuditLog = require("../models/auditLog");

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

