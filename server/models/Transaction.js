const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    payeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payee",
      required: true,
    },

    payeeName: {
      type: String,
      required: true,
      trim: true,
    },

    payeeAccountNumber: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    type: {
      type: String,
      enum: ["DEBIT"],
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

    // Kept only for compatibility with old transactions
    referenceId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Transfer method
    transferType: {
      type: String,
      enum: ["NEFT", "RTGS", "IMPS"],
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