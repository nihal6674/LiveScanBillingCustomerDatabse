const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    orgQboItemName: {
      type: String,
      required: true,
      trim: true,
    },
     invoiceMemo: {
      type: String,
      trim: true,
      default: "",
    },

    active: { type: Boolean, default: true },
    suspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/**
 * ✅ name + orgQboItemName must be unique together
 * ✅ Case-insensitive
 */
organizationSchema.index(
  { name: 1, orgQboItemName: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 },
  }
);

module.exports = mongoose.model("Organization", organizationSchema);
