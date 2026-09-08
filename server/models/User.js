const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ================================
    // CUSTOMER ADDRESS
    // ================================
    address: {
      type: String,
      required: true,
      trim: true,
    },

    // ================================
    // KYC DETAILS
    // ================================
    pan: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    aadhaar: {
      type: String,
      required: true,
      trim: true,
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },

    ifsc: {
      type: String,
      required: true,
      default: "BANK0001234",
      uppercase: true,
    },

    accountType: {
      type: String,
      enum: ["Savings", "Current"],
      default: "Savings",
    },

    branch: {
      type: String,
      default: "Main Branch",
      trim: true,
    },

    balance: {
      type: Number,
      default: 10000,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);