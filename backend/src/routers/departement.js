const express = require("express");
const router = express.Router();
const departementController = require("../controllers/departementController");

router.get("/", departementController.getAllDepartements);
router.get("/:id", departementController.getDepartementById);
router.post("/", departementController.createDepartement);
router.put("/:id", departementController.updateDepartement);
router.delete("/:id", departementController.deleteDepartement);

module.exports = router;
