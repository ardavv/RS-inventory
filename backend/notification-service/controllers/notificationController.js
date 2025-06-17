const { PrismaClient } = require("@prisma/client");
const { publishNotification } = require('../configs/rabbidmq');

const prisma = new PrismaClient();

exports.getNotifications = async (req, res) => {
    // Get All
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { notifDate: 'desc' },
        });
        const userId = req.headers["x-user-id"]; // <-- INI CARA AKSESNYA
        console.log("User ID from gateway:", userId);
        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to retrieve notifications!" });
    }
};

exports.deleteNotification = async (req, res) => {
    // Parse
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalid/tidak ada!" });
    // Delete
    try {
        await prisma.notification.delete({ where: { notifId: id } });
        res.status(204).end();
    } catch (err) {
        console.error("Error deleting notification:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Notification not found!" });
        }
        res.status(500).json({ error: 'Failed to delete notification!' });
    }
}

exports.postNotification = async (req, res) => {
    // Parse
    const { itemId, message } = req.body;
    if (!itemId || !message) {
        return res.status(400).json({ error: "Satu atau beberapa field kosong!" });
    }
    // Create
    try {
        // Save to DB
        const newNotification = await prisma.notification.create({
            data: {
                itemId,
                message
            }
        });
        // Publish to RabbidMQ now!
        await publishNotification({ itemId, message });
        // Done
        res.status(201).json(newNotification);
    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({ error: "Failed to create notification!" });
    }
}