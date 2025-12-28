const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const organizationRoutes = require("./routes/organization.routes");
const feeRoutes = require("./routes/fee.routes");
const serviceRoutes = require("./routes/service.routes");
const technicianRoutes = require("./routes/technician.routes");
const serviceRecordRoutes = require("./routes/serviceRecord.routes");
const exportRoutes = require("./routes/export.routes");
const adminRoutes=require("./routes/admin.route")
const staffRoutes=require("./routes/staff.routes")
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());        // ✅ THIS LINE IS REQUIRED
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/service-records", serviceRecordRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);


app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
