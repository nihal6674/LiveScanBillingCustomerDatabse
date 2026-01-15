const express = require("express");
const {
  createServiceRecord,
  updateServiceRecord,
  getMyServiceRecords,
  getServiceRecordById,
  getAllServiceRecords
} = require("../controllers/serviceRecord.controller");

const auth = require("../middlewares/auth.middleware");

const router = express.Router();

// CREATE (STAFF)
router.post("/", auth, createServiceRecord);

// JUST FOR ADMIN
router.get("/", auth, getAllServiceRecords);

// EDIT (STAFF + ADMIN with rules inside controller)
router.put("/:id", auth, updateServiceRecord);

// GET SELF ENTERED SERVICE RECORD (STAFF,ADMIN)
router.get("/my", auth, getMyServiceRecords);

router.get("/:id", auth, getServiceRecordById);

module.exports = router;
