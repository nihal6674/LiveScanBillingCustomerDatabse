const ServiceRecord = require("../models/ServiceRecord");
const Organization = require("../models/Organization");

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
