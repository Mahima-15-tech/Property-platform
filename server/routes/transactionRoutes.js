const express = require("express");
const router = express.Router();

const tx = require("../controllers/transactionController");
const protect = require("../middleware/authmiddleware");

router.get("/transactions", protect, tx.getTransactions);
router.put("/transactions/:id", protect, tx.updateTransactionStatus);

module.exports = router;