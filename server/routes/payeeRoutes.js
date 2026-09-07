const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addPayee,
  getPayees,
  deletePayee,
} = require("../controllers/payeeController");

router.use(protect);

router.post("/", addPayee);

router.get("/", getPayees);

router.delete("/:id", deletePayee);

module.exports = router;