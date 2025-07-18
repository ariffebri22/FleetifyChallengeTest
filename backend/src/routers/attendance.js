const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

router.post("/clock-in", attendanceController.clockIn);
router.put("/clock-out", attendanceController.clockOut);
router.get("/logs", attendanceController.getAttendanceLogs);

module.exports = router;
