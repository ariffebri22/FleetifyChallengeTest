// routers/index.js
const express = require("express");
const router = express.Router();
const Departement = require("./departement");
const Employee = require("./employee");
const Attendance = require("./attendance");

router.use("/departements", Departement);
router.use("/employees", Employee);
router.use("/attendance", Attendance);

module.exports = router;
