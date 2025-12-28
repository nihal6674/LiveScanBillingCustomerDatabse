const express = require("express");
const {
  createTechnician,
  getAllTechnicians,
  toggleTechnicianActive,
  getActiveTechniciansForStaff,
  updateTechnician
} = require("../controllers/technician.controller");

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { ADMIN, STAFF } = require("../constants/roles");

const router = express.Router();

/* STAFF */
router.get("/staff", auth, role(STAFF), getActiveTechniciansForStaff);

/* ADMIN */
router.post("/", auth, role(ADMIN), createTechnician);
router.get("/", auth, role(ADMIN), getAllTechnicians);
router.patch("/:id/active", auth, role(ADMIN), toggleTechnicianActive);
router.put("/:id",auth,role(ADMIN), updateTechnician);

module.exports = router;
