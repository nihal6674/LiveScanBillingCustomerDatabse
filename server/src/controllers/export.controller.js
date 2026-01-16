const ServiceRecord = require("../models/ServiceRecord");
const ExportBatch = require("../models/ExportBatch");
const { uploadToR2 } = require("../utils/uploadToR2");

const { Parser } = require("json2csv");
const XLSX = require("xlsx");

const formatMMDDYYYY = (date) => {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

exports.exportMonthly = async (req, res) => {
  try {

    const { startDate, endDate, format } = req.body;

    const exportDate = new Date(); // export execution date

    const dueDateObj = new Date(exportDate);
    dueDateObj.setDate(dueDateObj.getDate() + 14); // +14 days

    const dueDate = formatMMDDYYYY(dueDateObj);


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

    const invoiceMap = {}; // orgId -> invoiceNo




    // ✅ CREATE EXPORT BATCH FIRST (CRITICAL)
    const exportBatch = await ExportBatch.create({
      startDate: start,
      endDate: end,
      format,
      recordCount: records.length,
      exportedBy: req.user.userId,
    });

    // ✅ ONE invoice number per organization
    const getInvoiceNo = (r) => {
      const orgKey = r.organizationId.toString();

      if (!invoiceMap[orgKey]) {
        invoiceMap[orgKey] =
          `LS-${exportBatch._id.toString().slice(-6)}-${orgKey.slice(-4)}`;
      }

      return invoiceMap[orgKey];
    };


    // ✅ Prepare QBO-COMPLIANT rows (flat + safe)
    const rows = records.flatMap((r) => {
      const baseRow = {
        // 🔑 ONE INVOICE PER ORG
        "Invoice No": getInvoiceNo(r),

        // 👤 QBO CUSTOMER
        Customer: r.organizationQboItemName,

        // 📅 DATES
        "Invoice Date": formatMMDDYYYY(exportDate),
        "Due Date": dueDate,

        //Terms
        Terms: "Net 14",

        // 🧾 AUDIT / INTERNAL
        Organization: r.organizationName,
        ServiceDate: formatMMDDYYYY(r.serviceDate),
        Description: r.applicantName,
        BillingNumber: r.billingNumber,
        Technician: r.technicianName,
      };

      const serviceRow = {
        ...baseRow,

        // 📦 SERVICE LINE ITEM
        "Product/Service": r.qboItemName,
        "Item Quantity": r.quantity,
        Rate: r.serviceRate,
        Amount: r.serviceRate * r.quantity,

        Service: r.serviceName,
        "DOJ/FBI Fee": 0,
        Total: r.serviceRate * r.quantity,
      };

      // 👉 If NO DOJ/FBI fee
      if (!r.feeAmount || r.feeAmount === 0) {
        return [serviceRow];
      }

      // 👉 DOJ/FBI FEE LINE ITEM
      const feeRow = {
        ...baseRow,

        "Product/Service": "Live Scan DOJ/FBI Fee:Live Scan DOJ/FBI Fee",
        "Item Quantity": r.quantity,   // ✅ FIXED
        Rate: r.feeAmount,
        Amount: r.feeAmount * r.quantity,

        Service: "DOJ/FBI Fee",
        "DOJ/FBI Fee": r.feeAmount,
        Total: r.feeAmount * r.quantity,
      };


      return [serviceRow, feeRow];
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

    const fileKey = `exports/${exportBatch._id}/${fileName}`;

    // ✅ CSV Export
    if (format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(rows);

      const buffer = Buffer.from(csv);

      // ⬆️ UPLOAD TO R2
      await uploadToR2({
        buffer,
        key: fileKey,
        contentType: "text/csv",
      });

      // ⬆️ SAVE FILE KEY
      await ExportBatch.findByIdAndUpdate(exportBatch._id, {
        fileKey,
      });

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

    // ⬆️ UPLOAD TO R2
    await uploadToR2({
      buffer,
      key: fileKey,
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // ⬆️ SAVE FILE KEY
    await ExportBatch.findByIdAndUpdate(exportBatch._id, {
      fileKey,
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

const { getR2SignedUrl } = require("../utils/getSignedUrl");

exports.downloadExport = async (req, res) => {
  try {
    const batch = await ExportBatch.findById(req.params.id);

    if (!batch || !batch.fileKey) {
      return res.status(404).json({ message: "File not found" });
    }

    // optional: role check
    // if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

    const url = await getR2SignedUrl(batch.fileKey, 300); // 5 min

    res.json({ url });
  } catch (err) {
    console.error("DOWNLOAD EXPORT ERROR:", err);
    res.status(500).json({ message: "Failed to generate download link" });
  }
};
