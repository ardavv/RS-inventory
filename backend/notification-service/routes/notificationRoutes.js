const express = require("express");
const router = express.Router();

const controller = require("../controllers/notificationController");

// List Notifications
router.get("/", controller.getNotifications);

// Delete a Notification
router.delete("/:id", controller.deleteNotification);

// Post a Notification
router.post("/", controller.postNotification);

module.exports = router;