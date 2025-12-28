const ServiceRecord = require("../models/ServiceRecord");

exports.getStaffDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();

    // ---- Date boundaries ----
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday start

    // ---- Queries ----
    const [
      entriesToday,
      entriesThisWeek,
      unbilledEntries,
      lastEntry,
    ] = await Promise.all([
      ServiceRecord.countDocuments({
        enteredBy: userId,
        createdAt: { $gte: startOfToday },
      }),

      ServiceRecord.countDocuments({
        enteredBy: userId,
        createdAt: { $gte: startOfWeek },
      }),

      ServiceRecord.countDocuments({
        enteredBy: userId,
        billed: false,
      }),

      ServiceRecord.findOne(
        { enteredBy: userId },
        {},
        { sort: { createdAt: -1 } }
      ),
    ]);

    res.json({
      entriesToday,
      entriesThisWeek,
      unbilledEntries,
      lastEntry: lastEntry
        ? lastEntry.createdAt
        : null,
    });
  } catch (err) {
    console.error("STAFF DASHBOARD ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};