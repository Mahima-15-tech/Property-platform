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

  router.get("/dashboard", protect, authorize("broker"), broker.getBrokerDashboard);
router.get("/profile", protect, authorize("broker"), broker.getBrokerProfile);
router.get("/investors", protect, authorize("broker"), broker.getReferredInvestors);
router.get("/commissions", protect, authorize("broker"), broker.getCommissionDetails);
router.get("/earnings-summary", protect, authorize("broker"), broker.getEarningsSummary);

module.exports = router;