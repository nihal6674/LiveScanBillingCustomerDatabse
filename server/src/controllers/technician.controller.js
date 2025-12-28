const Technician = require("../models/Technician");

/* =======================
   ADMIN
   ======================= */

// CREATE
exports.createTechnician = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const tech = await Technician.create({ name });
    res.status(201).json(tech);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL (admin)
exports.getAllTechnicians = async (req, res) => {
  try {
    const techs = await Technician.find().sort({ name: 1 });
    res.json(techs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ENABLE / DISABLE
exports.toggleTechnicianActive = async (req, res) => {
  try {
    const { id } = req.params;

    const tech = await Technician.findById(id);
    if (!tech) {
      return res.status(404).json({ message: "Technician not found" });
    }

    tech.active = !tech.active;
    await tech.save();

    res.json({
      message: tech.active ? "Technician enabled" : "Technician disabled",
      tech,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   STAFF
   ======================= */

// ACTIVE ONLY
exports.getActiveTechniciansForStaff = async (req, res) => {
  try {
    const techs = await Technician.find({ active: true }).sort({ name: 1 });
    res.json(techs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE TECHNICIAN DETAILS (ADMIN)
exports.updateTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const tech = await Technician.findById(id);
    if (!tech) {
      return res.status(404).json({ message: "Technician not found" });
    }

    tech.name = name.trim();
    await tech.save();

    res.json({
      message: "Technician updated successfully",
      tech,
    });
  } catch (err) {
    console.error("UPDATE TECHNICIAN ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};

