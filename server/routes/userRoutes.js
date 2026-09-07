const express = require("express");

const protect = require("../middleware/authMiddleware");
const { getMyAccount } = require("../controllers/userController");

const router = express.Router();

// Get logged-in user's account
router.get("/me", protect, getMyAccount);

module.exports = router;