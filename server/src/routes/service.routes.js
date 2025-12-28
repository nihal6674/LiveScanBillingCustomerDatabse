const express = require("express");
const {
  createService,
  getAllServices,
  updateService,
  toggleServiceActive,
  getActiveServicesForStaff,
} = require("../controllers/service.controller");

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { ADMIN, STAFF } = require("../constants/roles");

const router = express.Router();

/* STAFF */
router.get("/staff", auth, role(STAFF), getActiveServicesForStaff);

/* ADMIN */
router.post("/create", auth, role(ADMIN), createService);
router.get("/", auth, role(ADMIN), getAllServices);
router.put("/:id", auth, role(ADMIN), updateService);
router.patch("/:id/active", auth, role(ADMIN), toggleServiceActive);

module.exports = router;
