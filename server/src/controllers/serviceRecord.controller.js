const ServiceRecord = require("../models/ServiceRecord");
const Organization = require("../models/Organization");
const Service = require("../models/Service");
const Fee = require("../models/Fee");
const Technician = require("../models/Technician");

// STAFF: create service entry
exports.createServiceRecord = async (req, res) => {
  try {
    const {
      serviceDate,
      organizationId,
      applicantName,
      billingNumber,
      serviceId,
      feeId,
      quantity = 1,
      technicianId,
    } = req.body;

    if (
      !serviceDate ||
      !organizationId ||
      !applicantName ||
      !billingNumber ||
      !serviceId ||
      !feeId ||
      !technicianId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ---- Organization ----
    const org = await Organization.findOne({
      _id: organizationId,
      active: true,
      suspended: false,
    });
    if (!org) {
      return res.status(400).json({ message: "Invalid organization" });
    }

    // ---- Service ----
    const service = await Service.findOne({
      _id: serviceId,
      active: true,
    });
    if (!service) {
      return res.status(400).json({ message: "Invalid service" });
    }

    // ---- Fee ----
    const fee = await Fee.findOne({
      _id: feeId,
      active: true,
    });
    if (!fee) {
      return res.status(400).json({ message: "Invalid fee" });
    }

    // ---- Technician ----
    const tech = await Technician.findOne({
      _id: technicianId,
      active: true,
    });
    if (!tech) {
      return res.status(400).json({ message: "Invalid technician" });
    }

    // ---- Create record with SNAPSHOTS ----
    const record = await ServiceRecord.create({
      serviceDate,
      organizationId,
      organizationName: org.name,

      applicantName: applicantName.toUpperCase(),
      billingNumber,

      serviceId,
      serviceName: service.name,
      qboItemName: service.qboItemName,
      serviceRate: service.rate,

      feeId,
      feeLabel: fee.label,
      feeAmount: fee.amount,

      quantity,

      technicianId,
      technicianName: tech.name,

      enteredBy: req.user.userId,
    });

    res.status(201).json(record);
  } catch (err) {
  console.error("Error while creating service record", err);
  res.status(500).json({ message: "Server error" });
}

};

exports.updateServiceRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await ServiceRecord.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Service record not found" });
    }

    // 🔒 Block edits after billing
    if (record.billed) {
      return res.status(403).json({
        message: "Billed records cannot be edited",
      });
    }

    // 🔐 STAFF can edit only their own records
    if (
      req.user.role === "STAFF" &&
      record.enteredBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Not allowed to edit this record" });
    }

    const {
      serviceDate,
      organizationId,
      applicantName,
      billingNumber,
      serviceId,
      feeId,
      quantity,
      technicianId,
    } = req.body;

    /* ---------------- Organization ---------------- */
    if (organizationId) {
      const org = await Organization.findOne({
        _id: organizationId,
        active: true,
        suspended: false,
      });
      if (!org) {
        return res.status(400).json({ message: "Invalid organization" });
      }

      record.organizationId = organizationId;
      record.organizationName = org.name;
    }

    /* ---------------- Service ---------------- */
    if (serviceId) {
      const service = await Service.findOne({
        _id: serviceId,
        active: true,
      });
      if (!service) {
        return res.status(400).json({ message: "Invalid service" });
      }

      record.serviceId = serviceId;
      record.serviceName = service.name;
      record.qboItemName = service.qboItemName;
      record.serviceRate = service.rate;
    }

    /* ---------------- Fee ---------------- */
    if (feeId) {
      const fee = await Fee.findOne({
        _id: feeId,
        active: true,
      });
      if (!fee) {
        return res.status(400).json({ message: "Invalid fee" });
      }

      record.feeId = feeId;
      record.feeLabel = fee.label;
      record.feeAmount = fee.amount;
    }

    /* ---------------- Technician ---------------- */
    if (technicianId) {
      const tech = await Technician.findOne({
        _id: technicianId,
        active: true,
      });
      if (!tech) {
        return res.status(400).json({ message: "Invalid technician" });
      }

      record.technicianId = technicianId;
      record.technicianName = tech.name;
    }

    /* ---------------- Simple fields ---------------- */
    if (serviceDate) record.serviceDate = serviceDate;
    if (applicantName) record.applicantName = applicantName.toUpperCase();
    if (billingNumber) record.billingNumber = billingNumber;
    if (quantity !== undefined) record.quantity = quantity;

    await record.save();

    res.json(record);
  } catch (err) {
    console.error("EDIT RECORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// serviceRecord.controller.js
exports.getMyServiceRecords = async (req, res) => {
  try {
    const records = await ServiceRecord.find({
      enteredBy: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// serviceRecord.controller.js
exports.getServiceRecordById = async (req, res) => {
  const record = await ServiceRecord.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Not found" });
  res.json(record);
};

// ADMIN: view all service records
exports.getAllServiceRecords = async (req, res) => {
  try {
    // 🔒 Admin-only check
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const records = await ServiceRecord.find()
      .populate("enteredBy", "email name") // ✅ ADD THIS
      .sort({ createdAt: -1 })
      .lean();

    res.json(records);
  } catch (err) {
    console.error("GET ALL RECORDS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
