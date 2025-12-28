const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },   // e.g. "DOJ – Standard"
    amount: { type: Number, required: true },  // e.g. 32
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);
