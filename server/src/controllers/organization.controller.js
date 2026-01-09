const Organization = require("../models/Organization");

// CREATE
exports.createOrganization = async (req, res) => {
  try {
    const { name, orgQboItemName } = req.body;

    if (!name || !orgQboItemName) {
      return res.status(400).json({
        message: "Organization name and QBO item name are required",
      });
    }

     const exists = await Organization.findOne({
      name: name.trim(),
      orgQboItemName: orgQboItemName.trim(),
    });


    if (exists) {
      return res.status(400).json({
        message: "Organization name or QBO item name already exists",
      });
    }

    const org = await Organization.create({
      name,
      orgQboItemName,
    });

    res.status(201).json(org);
  } catch (err) {
    console.error("CREATE ORG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL (Admin)
exports.getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().sort({ name: 1 });
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE (rename)
exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, orgQboItemName } = req.body;

    const org = await Organization.findById(id);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (name) org.name = name;
    if (orgQboItemName) org.orgQboItemName = orgQboItemName;

    await org.save();
    res.json(org);
  } catch (err) {
    console.error("UPDATE ORG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// SUSPEND / ACTIVATE
exports.toggleSuspend = async (req, res) => {
  try {
    const { id } = req.params;

    const org = await Organization.findById(id);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    org.suspended = !org.suspended;
    await org.save();

    res.json({
      message: org.suspended
        ? "Organization suspended"
        : "Organization reactivated",
      org,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ACTIVATE / DEACTIVATE (soft delete)
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;

    const org = await Organization.findById(id);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    org.active = !org.active;
    await org.save();

    res.json({
      message: org.active
        ? "Organization activated"
        : "Organization deactivated",
      org,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// STAFF: get active organizations only
exports.getActiveOrganizationsForStaff = async (req, res) => {
  try {
    const orgs = await Organization.find({
      active: true,
      suspended: false,
    }).sort({ name: 1 });

    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

