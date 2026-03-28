const express = require("express");
const router = express.Router();

const portfolio = require("../controllers/portfolioController");
const protect = require("../middleware/authmiddleware");

router.get("/", protect, portfolio.getPortfolio);

module.exports = router;