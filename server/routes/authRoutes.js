const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const User = require("../models/user");
const authmiddleware = require("../middleware/authmiddleware");

router.post("/register", auth.register);
router.post("/verify-otp", auth.verifyOtp);
router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);
router.get("/me", authmiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  });

module.exports = router;