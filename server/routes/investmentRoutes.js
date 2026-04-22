const express = require("express");
const router = express.Router();

const invest = require("../controllers/investmentController");
const protect = require("../middleware/authmiddleware");

router.post("/", protect, invest.invest);
router.get("/checkout/:propertyId",  invest.getCheckoutData);
router.post("/create", protect, invest.createInvestment);

module.exports = router;