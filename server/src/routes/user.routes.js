const express = require("express");
const router = express.Router();

const {
  updateUser,
  toggleUserActive,
} = require("../controllers/user.controller");
const auth=require("../middlewares/auth.middleware")
const role = require("../middlewares/role.middleware");
const { ADMIN } = require("../constants/roles");

// Edit user (ADMIN only)
router.put("/:id",auth, role(ADMIN), updateUser);

// Activate / Deactivate user (ADMIN only)
router.patch("/:id/active", auth , role(ADMIN), toggleUserActive);

module.exports = router;
