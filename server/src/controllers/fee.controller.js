const Fee = require("../models/Fee");

/* =======================
   ADMIN
   ======================= */

// CREATE
exports.createFee = async (req, res) => {
  try {
    const { label, amount } = req.body;

    if (!label || amount === undefined) {
      return res.status(400).json({ message: "Label and amount required" });
    }

    const fee = await Fee.create({ label, amount });
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL (admin)
exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().sort({ label: 1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
exports.updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, amount } = req.body;

    const fee = await Fee.findById(id);
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    if (label) fee.label = label;
    if (amount !== undefined) fee.amount = amount;

    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ENABLE / DISABLE
exports.toggleFeeActive = async (req, res) => {
  try {
    const { id } = req.params;

    const fee = await Fee.findById(id);
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    fee.active = !fee.active;
    await fee.save();

    res.json({
      message: fee.active ? "Fee enabled" : "Fee disabled",
      fee,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   STAFF
   ======================= */

// READ ONLY (active fees)
exports.getActiveFeesForStaff = async (req, res) => {
  try {
    const fees = await Fee.find({ active: true }).sort({ label: 1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
