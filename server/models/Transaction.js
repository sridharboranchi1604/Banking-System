
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional for self-deposit transactions
    payeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payee",
      required: false,
    },

    payeeName: {
      type: String,
      trim: true,
      default: "Self Deposit",
    },

    payeeAccountNumber: {
      type: String,
      trim: true,
      default: "SELF-DEPOSIT",
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    // DEBIT = Money transferred out
    // CREDIT = Money deposited into the account
    type: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      default: "DEBIT",
    },

    status: {
      type: String,
      enum: ["COMPLETED", "FAILED"],
      default: "COMPLETED",
    },

    // UTR for new transactions
    utr: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Kept for compatibility with old transactions
    referenceId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Transfer method
    transferType: {
      type: String,
      enum: ["NEFT", "RTGS", "IMPS", "SELF_DEPOSIT"],
      required: true,
    },

    description: {
      type: String,
      default: "Money Transfer",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);