const ServiceRecord = require("../models/ServiceRecord");
const ExportBatch = require("../models/ExportBatch");

const { Parser } = require("json2csv");
const XLSX = require("xlsx");

exports.exportMonthly = async (req, res) => {
  try {
    console.log("EXPORT BODY 👉", req.body);

    const { startDate, endDate, format } = req.body;

    // ✅ Validation
    if (!startDate || !endDate || !format) {
      return res.status(400).json({
        message: "startDate, endDate, and format are required",
      });
    }

    if (!["csv", "xlsx"].includes(format)) {
      return res.status(400).json({
        message: "Invalid export format",
      });
    }

    // ✅ Date normalization
    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);

    // ✅ Fetch ONLY unbilled records
    const records = await ServiceRecord.find({
      serviceDate: { $gte: start, $lte: end },
      billed: false,
    }).sort({ organizationName: 1, serviceDate: 1 });

    if (records.length === 0) {
      return res.status(400).json({
        message: "No unbilled records found for selected period",
      });
    }

    // ✅ Prepare QBO-COMPLIANT rows (flat + safe)
    const rows = records.map((r) => ({
      // 🔑 QBO GROUPING KEY
      Customer: r.organizationName,

      // 🔑 QBO INVOICE FIELDS
      "Invoice Date": r.serviceDate.toISOString().slice(0, 10),
      "Product/Service": r.qboItemName,
      Qty: r.quantity,
      Rate: r.serviceRate,
      Amount: r.serviceRate * r.quantity,

      // 🧾 INTERNAL / AUDIT FIELDS (ignored by QBO)
      Organization: r.organizationName,
      ServiceDate: r.serviceDate.toISOString().slice(0, 10),
      Service: r.serviceName,
      Applicant: r.applicantName,
      BillingNumber: r.billingNumber,
      "DOJ/FBI Fee": r.feeAmount,
      Total: (r.serviceRate + r.feeAmount) * r.quantity,
      Technician: r.technicianName,
    }));

    // ✅ CREATE EXPORT BATCH FIRST (CRITICAL)
    const exportBatch = await ExportBatch.create({
      startDate: start,
      endDate: end,
      format,
      recordCount: records.length,
      exportedBy: req.user.userId,
    });

    // ✅ UPDATE SERVICE RECORDS WITH BATCH INFO
    await ServiceRecord.updateMany(
      {
        _id: { $in: records.map((r) => r._id) },
        billed: false, // safety
      },
      {
        $set: {
          billed: true,
          billedAt: new Date(),
          exportBatchId: exportBatch._id,
        },
      }
    );

    // ✅ Professional filename
    const fileName = `LiveScan_HouseAccounts_${startDate}_to_${endDate}.${format}`;

    // ✅ CSV Export
    if (format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(rows);

      res.header("Content-Type", "text/csv");
      res.attachment(fileName);
      return res.send(csv);
    }

    // ✅ XLSX Export
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Export");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.header(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.attachment(fileName);
    return res.send(buffer);

  } catch (err) {
    console.error("EXPORT ERROR 👉", err);
    return res.status(500).json({
      message: "Server error during export",
    });
  }
};


exports.getExportHistory = async (req, res) => {
  try {
    const history = await ExportBatch.find()
  .sort({ createdAt: -1 })
  .populate("exportedBy", "email");


    res.json(history);
  } catch (err) {
    console.error("EXPORT HISTORY ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};
