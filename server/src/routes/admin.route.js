const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { ADMIN } = require("../constants/roles");
const {
  getDashboardStats,
  createStaff,
  getStaff,
  toggleStaffStatus,
  resetStaffPassword,
  updateStaff
} = require("../controllers/admin.controller");

router.get("/dashboard-stats", auth, role(ADMIN), getDashboardStats);
router.post("/staff", auth, role(ADMIN), createStaff);
router.get("/staff", auth, role(ADMIN), getStaff);
router.patch("/staff/:id/status", auth, role(ADMIN), toggleStaffStatus)
router.patch("/staff/:id/password", auth, role(ADMIN), resetStaffPassword);
router.patch("/staff/:id", auth, role(ADMIN), updateStaff);

module.exports = router;
