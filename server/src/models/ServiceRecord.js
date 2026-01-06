const mongoose = require("mongoose");

const serviceRecordSchema = new mongoose.Schema(
  {
    serviceDate: { type: Date, required: true },

    // ---- Organization ----
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    organizationName: { type: String, required: true }, // SNAPSHOT

     organizationQboItemName: {
      type: String,
      required: true,
    }, // ✅ NEW SNAPSHOT (QBO CUSTOMER NAME)

    // ---- Applicant ----
    applicantName: { type: String, required: true }, // ALL CAPS
    billingNumber: {
      type: String,
      required: true,
      match: /^\d{6}$/,
    },

    // ---- Service ----
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    serviceName: { type: String, required: true }, // SNAPSHOT
    qboItemName: { type: String, required: true },  // SNAPSHOT
    serviceRate: { type: Number, required: true },  // SNAPSHOT

    // ---- DOJ / FBI Fee ----
    feeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fee",
      required: true,
    },
    feeLabel: { type: String, required: true },     // SNAPSHOT
    feeAmount: { type: Number, required: true },    // SNAPSHOT

    quantity: { type: Number, default: 1 },

    // ---- Technician ----
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
      required: true,
    },
    technicianName: { type: String, required: true }, // SNAPSHOT

    // ---- Meta ----
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    billed: { type: Boolean, default: false },
    billedAt: { type: Date, default: null },
    exportBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExportBatch",
      default: null,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("ServiceRecord", serviceRecordSchema);
