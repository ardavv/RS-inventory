const express = require("express");
const router = express.Router();

const controller = require("../controllers/trackingController");

// List Item Movements
router.get("/", controller.viewAll);

// List an Item Movement
router.get("/:id", controller.viewItem);

// Post an Item Movement
router.post("/", controller.postItem);

// Edit an Item Movement
router.put("/:id", controller.editItem);

// Delete an Item Movement
router.delete("/:id", controller.deleteItem);

module.exports = router;