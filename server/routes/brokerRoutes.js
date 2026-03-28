const express = require("express");
const router = express.Router();
const broker = require("../controllers/brokercontroller");
const protect = require("../middleware/authmiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/register", broker.registerBroker);
router.get("/all", protect, authorize("admin"), broker.getAllBrokers);
router.get(
    "/breakdown",
    protect,
    authorize("admin"),
    broker.getCommissionBreakdown
  );

module.exports = router;