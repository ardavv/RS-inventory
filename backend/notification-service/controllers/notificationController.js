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
        await prisma.notification.delete({ where: { notifId: id } });
        res.status(204).end();
    } catch (err) {
        res.status(404).json({ error: 'Notification not found!' });
    }
}

exports.postNotification = async (req, res) => {
    const { itemId, message } = req.body;
    
    if (!itemId || !message) {
        return res.status(400).json({ error: "itemId dan message dibutuhkan!" });
    }
    
    // Save to DB
    const newNotification = await prisma.notification.create({
        data: { itemId, message },
    });
    
    // Publish to RabbidMQ
    await publishNotification({ itemId, message });

    res.status(201).json(newNotification);
}