const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const homeController = require("../controllers/homeController");
const itemController = require("../controllers/itemController");

// Home
router.get("/", homeController.getHome);

// Browse
router.get("/browse", itemController.getBrowse);

// Report Page
router.get("/report", itemController.getReport);

// Save Report
router.post(
    "/report",
    upload.single("image"),
    itemController.createReport
);

// My Reports
router.get("/my-reports", itemController.getMyReports);

// Edit Report
router.get("/edit/:id", itemController.getEditReport);

router.post(
    "/edit/:id",
    upload.single("image"),
    itemController.updateReport
);

// Delete Report
router.post("/delete/:id", itemController.deleteReport);

router.post("/status/:id", itemController.toggleStatus);

module.exports = router;