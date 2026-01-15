const ServiceRecord = require("../models/ServiceRecord");
const Organization = require("../models/Organization");
const User=require("../models/User")
const bcrypt = require("bcryptjs");


exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // ----- Date ranges -----
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // ----- Counts -----
    const [
      unbilledCount,
      entriesThisMonth,
      activeOrganizations,
      suspendedOrganizations,
      unbilledOlderThan30,
    ] = await Promise.all([
      ServiceRecord.countDocuments({ billed: false }),

      ServiceRecord.countDocuments({
        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
      }),

      Organization.countDocuments({
        active: true,
        suspended: false,
      }),

      Organization.countDocuments({
        suspended: true,
      }),

      ServiceRecord.countDocuments({
        billed: false,
        serviceDate: { $lt: thirtyDaysAgo },
      }),
    ]);

    // ----- Last export inference -----
    const lastExportedRecord = await ServiceRecord.findOne(
      { billed: true },
      {},
      { sort: { updatedAt: -1 } }
    );

    let lastExportDate = null;
    let lastExportCount = 0;
    let exportDoneThisMonth = false;

    if (lastExportedRecord) {
      lastExportDate = lastExportedRecord.updatedAt
        .toISOString()
        .slice(0, 10);

      const exportMonthStart = new Date(
        lastExportedRecord.updatedAt.getFullYear(),
        lastExportedRecord.updatedAt.getMonth(),
        1
      );
      const exportMonthEnd = new Date(
        lastExportedRecord.updatedAt.getFullYear(),
        lastExportedRecord.updatedAt.getMonth() + 1,
        1
      );

      lastExportCount = await ServiceRecord.countDocuments({
        billed: true,
        updatedAt: { $gte: exportMonthStart, $lt: exportMonthEnd },
      });

      exportDoneThisMonth =
        exportMonthStart.getMonth() === now.getMonth() &&
        exportMonthStart.getFullYear() === now.getFullYear();
    }

    res.json({
      unbilledCount,
      entriesThisMonth,
      activeOrganizations,
      suspendedOrganizations,

      lastExportDate,
      lastExportCount,
      unbilledOlderThan30,
      exportDoneThisMonth,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD STATS ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "STAFF",     // 🔒 enforced here
      active: true,      // default
    });

    res.status(201).json({
      message: "Staff created successfully",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        active: staff.active,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStaff = async (req, res) => {
  const staff = await User.find({ role: "STAFF" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json(staff);
};

exports.toggleStaffStatus = async (req, res) => {
  const staff = await User.findOne({
    _id: req.params.id,
    role: "STAFF",
  });

  if (!staff) {
    return res.status(404).json({ message: "Staff not found" });
  }

  staff.active = !staff.active;
  await staff.save();

  res.json({
    message: "Status updated",
    active: staff.active,
  });
};

exports.resetStaffPassword = async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password too short" });
  }

  const staff = await User.findOne({
    _id: req.params.id,
    role: "STAFF",
  });

  if (!staff) {
    return res.status(404).json({ message: "Staff not found" });
  }

  staff.password = await bcrypt.hash(password, 10);
  await staff.save();

  res.json({ message: "Password updated successfully" });
};

exports.updateStaff = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email?.toLowerCase() || user.email;

    await user.save();

    res.json({ message: "Staff updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
