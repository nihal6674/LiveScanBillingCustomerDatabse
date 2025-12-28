const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { STAFF } = require("../constants/roles");

const {
  getStaffDashboardStats,
} = require("../controllers/staff.controller");

router.get(
  "/dashboard-stats",
  auth,
  role(STAFF),
  getStaffDashboardStats
);

module.exports = router;
