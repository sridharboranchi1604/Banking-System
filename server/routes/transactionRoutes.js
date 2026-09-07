const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  transferMoney,
  getTransactions,
} = require("../controllers/transferController");

const router = express.Router();

// All transaction operations require login
router.use(protect);

// Transfer money
router.post("/transfer", transferMoney);

// Transaction history
router.get("/", getTransactions);

module.exports = router;