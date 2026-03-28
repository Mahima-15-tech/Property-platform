const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, referralCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let referredBy = null;

    // 🔥 referral logic
    if (referralCode) {
      const broker = await User.findOne({ referralCode });

      if (broker) {
        referredBy = broker._id;
      }
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "investor",

      referredBy, // 🔥 attach broker

      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    res.json({
      message: "User registered. Verify OTP",
      otp,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      
      if (!user.otp || user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
  
    user.isVerified = true;
    user.otp = null;
  
    await user.save();
  
    res.json({ message: "Account verified" });
  };


  const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  if (!user.isVerified) {
    return res.status(400).json({ message: "Verify OTP first" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }


  if (user.role === "broker" && !user.isApproved) {
    return res.status(403).json({
      message: "Your account is pending admin approval",
    });
  }

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

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) return res.status(400).json({ message: "User not found" });
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
  
    await user.save();
  
    res.json({ message: "OTP sent", otp });
  };

  exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    user.password = hashedPassword;
    user.otp = null;
  
    await user.save();
  
    res.json({ message: "Password reset successful" });
  };