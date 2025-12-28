const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    qboItemName: {
      type: String,
      required: true,
      trim: true,
    },

    rate: {
      type: Number,
      required: true,
    },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 🔐 Prevent duplicate service names (case-insensitive)
serviceSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Service", serviceSchema);
