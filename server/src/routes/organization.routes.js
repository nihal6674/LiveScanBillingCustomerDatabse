const express = require("express");
const {
  createOrganization,
  getOrganizations,
  updateOrganization,
  toggleSuspend,
  toggleActive,
  getActiveOrganizationsForStaff,
} = require("../controllers/organization.controller");

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { ADMIN, STAFF } = require("../constants/roles");

const router = express.Router();

/* =======================
   STAFF ROUTE (READ ONLY)
   ======================= */
router.get(
  "/staff",
  auth,
  role(STAFF),
  getActiveOrganizationsForStaff
);

/* =======================
   ADMIN ROUTES
   ======================= */
router.post("/", auth, role(ADMIN), createOrganization);
router.get("/", auth, role(ADMIN), getOrganizations);
router.put("/:id", auth, role(ADMIN), updateOrganization);

router.patch("/:id/suspend", auth, role(ADMIN), toggleSuspend);
router.patch("/:id/active", auth, role(ADMIN), toggleActive);

module.exports = router;
