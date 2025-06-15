const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Notification Service");
});

router.get("/:id", (req, res) => {
    res.send("Notification Service");
});

router.post("/", (req, res) => {
    res.send("Notification Service");
});

module.exports = router;