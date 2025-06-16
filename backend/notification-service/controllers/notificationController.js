const { PrismaClient } = require("@prisma/client");
const { publishNotification } = require('../configs/rabbidmq');

const prisma = new PrismaClient();

exports.getNotifications = async (req, res) => {
    const notifications = await prisma.notification.findMany({
        orderBy: { notifDate: 'desc' },
    });
    res.json(notifications);
};

exports.deleteNotification = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.notification.delete({ where: { notifID: id } });
        res.status(204).end();
    } catch (err) {
        res.status(404).json({ error: 'Notification not found!' });
    }
}

exports.postNotification = async (req, res) => {
    const { itemID, message } = req.body;
    
    if (!itemID || !message) {
        return res.status(400).json({ error: "itemID and message are required" });
    }
    
    // Save to DB
    const newNotification = await prisma.notification.create({
        data: { itemID, message },
    });
    
    // Publish to RabbidMQ
    await publishNotification({ itemID, message });

    res.status(201).json(newNotification);
}