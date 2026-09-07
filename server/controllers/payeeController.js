const Payee = require("../models/Payee");

// ===============================
// ADD PAYEE
// ===============================
const addPayee = async (req, res) => {
  try {
    const { name, accountNumber, ifsc, bankName } = req.body;

    // Validate required fields
    if (!name || !accountNumber || !ifsc || !bankName) {
      return res.status(400).json({
        success: false,
        message: "All payee details are required",
      });
    }

    // Check if this payee account already exists
    const existingPayee = await Payee.findOne({
      userId: req.userId,
      accountNumber: accountNumber.trim(),
    });

    if (existingPayee) {
      return res.status(400).json({
        success: false,
        message: "This payee is already added",
      });
    }

    // Create payee
    const payee = await Payee.create({
      userId: req.userId,
      name: name.trim(),
      accountNumber: accountNumber.trim(),
      ifsc: ifsc.trim().toUpperCase(),
      bankName: bankName.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Payee added successfully",
      payee,
    });
  } catch (error) {
    console.error("Add Payee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add payee",
      error: error.message,
    });
  }
};


// ===============================
// GET ALL PAYEES
// ===============================
const getPayees = async (req, res) => {
  try {
    const payees = await Payee.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payees,
    });
  } catch (error) {
    console.error("Get Payees Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payees",
      error: error.message,
    });
  }
};


// ===============================
// DELETE PAYEE
// ===============================
const deletePayee = async (req, res) => {
  try {
    const { id } = req.params;

    // Only delete a payee belonging to the logged-in user
    const payee = await Payee.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!payee) {
      return res.status(404).json({
        success: false,
        message: "Payee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payee deleted successfully",
    });
  } catch (error) {
    console.error("Delete Payee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete payee",
      error: error.message,
    });
  }
};


// ===============================
// EXPORT CONTROLLERS
// ===============================
module.exports = {
  addPayee,
  getPayees,
  deletePayee,
};