const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Payee = require("../models/Payee");
const Transaction = require("../models/Transaction");

// =========================================================
// GENERATE DEMO UTR
// =========================================================

const generateUTR = () => {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");

  const randomNumber = Math.floor(
    100000 + Math.random() * 900000
  );

  return `YESB${year}${month}${day}${hours}${minutes}${seconds}${randomNumber}`;
};

// =========================================================
// TRANSFER MONEY
// =========================================================

const transferMoney = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      payeeId,
      amount,
      transferType,
      description,
      password,
    } = req.body;

    // =====================================================
    // BASIC VALIDATION
    // =====================================================

    if (
      !payeeId ||
      amount === undefined ||
      !transferType ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payee, amount, transfer type and password are required.",
      });
    }

    const transferAmount = Number(amount);

    if (
      !Number.isFinite(transferAmount) ||
      transferAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid transfer amount.",
      });
    }

    // =====================================================
    // DECIMAL VALIDATION
    // =====================================================

    const decimalValue = Math.round(
      transferAmount * 100
    );

    if (
      Math.abs(
        transferAmount * 100 - decimalValue
      ) > 0.000001
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount can have maximum two decimal places.",
      });
    }

    // =====================================================
    // TRANSFER TYPE VALIDATION
    // =====================================================

    const allowedTransferTypes = [
      "NEFT",
      "RTGS",
      "IMPS",
    ];

    if (!allowedTransferTypes.includes(transferType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transfer type.",
      });
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    // =====================================================
    // PASSWORD VERIFICATION
    // =====================================================

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Incorrect password. Transfer cancelled.",
      });
    }

    // =====================================================
    // FIND PAYEE
    // =====================================================

    const payee = await Payee.findOne({
      _id: payeeId,
      userId: req.userId,
    });

    if (!payee) {
      return res.status(404).json({
        success: false,
        message: "Payee not found.",
      });
    }

    let transaction;

    // =====================================================
    // DATABASE TRANSACTION
    // =====================================================

    await session.withTransaction(async () => {
      const currentUser =
        await User.findById(req.userId).session(session);

      if (!currentUser) {
        throw new Error("USER_NOT_FOUND");
      }

      // ===================================================
      // CHECK BALANCE
      // ===================================================

      if (
        Number(currentUser.balance) <
        transferAmount
      ) {
        throw new Error(
          "INSUFFICIENT_BALANCE"
        );
      }

      // ===================================================
      // DEDUCT BALANCE
      // ===================================================

      const updatedUser =
        await User.findOneAndUpdate(
          {
            _id: req.userId,
            balance: {
              $gte: transferAmount,
            },
          },
          {
            $inc: {
              balance: -transferAmount,
            },
          },
          {
            session,
            returnDocument: "after",
          }
        );

      if (!updatedUser) {
        throw new Error(
          "INSUFFICIENT_BALANCE"
        );
      }

      // ===================================================
      // GENERATE UTR
      // ===================================================

      const utr = generateUTR();

      // ===================================================
      // CREATE TRANSACTION
      // ===================================================

      const createdTransactions =
        await Transaction.create(
          [
            {
              userId: req.userId,

              payeeId: payee._id,

              payeeName: payee.name,

              payeeAccountNumber:
                payee.accountNumber,

              amount: transferAmount,

              type: "DEBIT",

              status: "COMPLETED",

              utr,

              transferType,

              description:
                description?.trim() ||
                "Money Transfer",
            },
          ],
          {
            session,
          }
        );

      transaction =
        createdTransactions[0];
    });

    // =====================================================
    // GET UPDATED BALANCE
    // =====================================================

    const latestUser =
      await User.findById(req.userId).select(
        "name balance accountNumber"
      );

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Money transferred successfully.",

      transaction,

      balance: latestUser.balance,
    });

  } catch (error) {
    console.error(
      "Transfer error:",
      error
    );

    if (
      error.message ===
      "INSUFFICIENT_BALANCE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Insufficient balance for this transfer.",
      });
    }

    if (
      error.message ===
      "USER_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "User account not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Transfer failed. Please try again.",
    });

  } finally {
    await session.endSession();
  }
};

// =========================================================
// GET TRANSACTION HISTORY
// =========================================================

const getTransactions = async (
  req,
  res
) => {
  try {
    const transactions =
      await Transaction.find({
        userId: req.userId,
      })
        .sort({
          createdAt: -1,
        })
        .populate(
          "payeeId",
          "name bankName accountNumber ifsc"
        );

    return res.json({
      success: true,
      transactions,
    });

  } catch (error) {
    console.error(
      "Transaction history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch transaction history.",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  transferMoney,
  getTransactions,
};