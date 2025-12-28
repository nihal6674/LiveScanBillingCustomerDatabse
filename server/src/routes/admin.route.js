const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { ADMIN } = require("../constants/roles");

const {
  getDashboardStats,
} = require("../controllers/admin.controller");

router.get("/dashboard-stats", auth, role(ADMIN), getDashboardStats);

module.exports = router;
