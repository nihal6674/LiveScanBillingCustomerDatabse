const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

    active: { type: Boolean, default: true },      // exists in system
    suspended: { type: Boolean, default: false },  // billing blocked
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", organizationSchema);
