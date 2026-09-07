const mongoose = require("mongoose");

const User = require("../models/User");
const Payee = require("../models/Payee");
const Transaction = require("../models/Transaction");


// ==========================================
// TRANSFER MONEY
// ==========================================

const transferMoney = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { payeeId, amount, description } = req.body;

    // -------------------------------
    // Validate input
    // -------------------------------

    if (!payeeId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Payee and amount are required.",
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

    if (
      !Number.isInteger(
        Math.round(transferAmount * 100)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount can have maximum two decimal places.",
      });
    }

    // -------------------------------
    // Find payee belonging to user
    // -------------------------------

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

    // -------------------------------
    // Start MongoDB transaction
    // -------------------------------

    let transaction;

    await session.withTransaction(async () => {

      // Find logged-in user's account
      const user = await User.findById(
        req.userId
      ).session(session);

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      // Check balance
      if (Number(user.balance) < transferAmount) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      // Deduct money atomically
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
        throw new Error("INSUFFICIENT_BALANCE");
      }

      // Generate transaction reference
      const referenceId =
        "TXN" +
        Date.now() +
        Math.floor(
          1000 + Math.random() * 9000
        );

      // Create transaction record
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
              referenceId,
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

    // -------------------------------
    // Success
    // -------------------------------

    const latestUser =
      await User.findById(req.userId).select(
        "name balance accountNumber"
      );

    res.status(200).json({
      success: true,
      message: "Money transferred successfully.",
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
        message: "User account not found.",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Transfer failed. Please try again.",
    });
  } finally {
    await session.endSession();
  }
};


// ==========================================
// GET TRANSACTION HISTORY
// ==========================================

const getTransactions = async (req, res) => {
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

    res.json({
      success: true,
      transactions,
    });

  } catch (error) {

    console.error(
      "Transaction history error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch transaction history.",
    });
  }
};


module.exports = {
  transferMoney,
  getTransactions,
};