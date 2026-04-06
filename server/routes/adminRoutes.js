const express = require("express");
const router = express.Router();

const admin = require("../controllers/adminController");
const protect = require("../middleware/authmiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/login", admin.adminLogin);

router.patch(
  "/approve-broker/:id",
  protect,              // 🔐 login check
  authorize("admin"),   // 👑 role check
  admin.approveBroker
);

router.patch(
  "/kyc/:id/approve",
  protect,
  authorize("admin"),
  admin.approveKyc
);

router.patch(
  "/kyc/:id/reject",
  protect,
  authorize("admin"),
  admin.rejectKyc
);




module.exports = router;