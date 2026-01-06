const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // 🔗 QBO customer / item mapping
    orgQboItemName: {
      type: String,
      required: true,
      trim: true,
    },

    active: { type: Boolean, default: true },      // exists in system
    suspended: { type: Boolean, default: false },  // billing blocked
  },
  { timestamps: true }
);

// 🔐 Prevent duplicate organization names (case-insensitive)
organizationSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

// 🔐 Prevent duplicate QBO org names (case-insensitive)
organizationSchema.index(
  { orgQboItemName: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Organization", organizationSchema);
