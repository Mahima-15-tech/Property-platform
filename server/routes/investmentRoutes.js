const express = require("express");
const router = express.Router();

const invest = require("../controllers/investmentController");
const protect = require("../middleware/authmiddleware");

router.post("/", protect, invest.invest);

module.exports = router;