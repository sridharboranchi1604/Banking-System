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
    },

    payeeAccountNumber: {
      type: String,
      required: true,
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

    referenceId: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      default: "Money Transfer",
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