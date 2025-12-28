const Service = require("../models/Service");

/* =======================
   ADMIN
   ======================= */

// CREATE UNIQUE SERVICE
exports.createService = async (req, res) => {
  try {
    const { name, qboItemName, rate } = req.body;

    if (!name || !qboItemName || rate === undefined) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ✅ Check duplicate (case-insensitive)
    const existing = await Service.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (existing) {
      return res.status(400).json({
        message: "Service with this name already exists",
      });
    }

    const service = await Service.create({
      name: name.trim(),
      qboItemName: qboItemName.trim(),
      rate,
    });

    res.status(201).json(service);
  } catch (err) {
    // ✅ Handle Mongo duplicate index error (final safety net)
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Service with this name already exists",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL (admin)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, qboItemName, rate } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (name) service.name = name;
    if (qboItemName) service.qboItemName = qboItemName;
    if (rate !== undefined) service.rate = rate;

    await service.save();
    res.json(service);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ENABLE / DISABLE
exports.toggleServiceActive = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.active = !service.active;
    await service.save();

    res.json({
      message: service.active ? "Service enabled" : "Service disabled",
      service,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   STAFF
   ======================= */

// ACTIVE ONLY
exports.getActiveServicesForStaff = async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ name: 1 });
    res.json(services);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
