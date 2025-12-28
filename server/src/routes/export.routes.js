const express = require("express");
const { exportMonthly } = require("../controllers/export.controller");

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { ADMIN } = require("../constants/roles");

const router = express.Router();

router.post("/monthly", auth, role(ADMIN), exportMonthly);

router.get(
  "/history",
  auth,
  role(ADMIN),
  require("../controllers/export.controller").getExportHistory
);

module.exports = router;
