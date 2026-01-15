const express = require("express");
const { exportMonthly, getExportHistory, downloadExport } = require("../controllers/export.controller");

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { ADMIN } = require("../constants/roles");

const router = express.Router();

router.post("/monthly", auth, role(ADMIN), exportMonthly);

router.get(
  "/history",
  auth,
  role(ADMIN),
  getExportHistory
);

router.get("/:id/download", auth, role(ADMIN), downloadExport);

module.exports = router;
