const mongoose = require("mongoose");

const exportBatchSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    format: {
      type: String,
      enum: ["csv", "xlsx"],
      required: true,
    },

    recordCount: { type: Number, required: true },

    exportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    selectAllOrganizations: {
      type: Boolean,
      default: true,
    },

    organizationIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
      },
    ],
    
     fileKey: { type: String },

  },
  { timestamps: true }
);

module.exports = mongoose.model("ExportBatch", exportBatchSchema);
