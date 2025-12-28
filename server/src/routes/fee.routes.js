const express = require("express");
const {
  createFee,
  getAllFees,
  updateFee,
  toggleFeeActive,
  getActiveFeesForStaff,
} = require("../controllers/fee.controller");

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { ADMIN, STAFF } = require("../constants/roles");

const router = express.Router();

/* =======================
   STAFF (READ ONLY)
   ======================= */
router.get("/staff", auth, role(STAFF), getActiveFeesForStaff);

/* =======================
   ADMIN
   ======================= */
router.post("/", auth, role(ADMIN), createFee);
router.get("/", auth, role(ADMIN), getAllFees);
router.put("/:id", auth, role(ADMIN), updateFee);
router.patch("/:id/active", auth, role(ADMIN), toggleFeeActive);

module.exports = router;
