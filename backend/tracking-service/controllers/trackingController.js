const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.viewAll = async (req, res) => {
    try {
        const tracks = await prisma.itemTrack.findMany();
        res.json(tracks);
    } catch (error) {
        console.error("Error fetching item tracks:", error);
        res.status(500).json({ error: "Failed to retrieve item tracks" });
    }
};

exports.viewItem = async (req, res) => {
    const moveId = parseInt(req.params.id);
    if (isNaN(moveId)) return res.status(400).json({ error: "Invalid ID" });

    try {
        const track = await prisma.itemTrack.findUnique({ where: { moveId } });
        if (!track) return res.status(404).json({ error: "ItemTrack not found" });
        res.json(track);
    } catch (error) {
        console.error("Error fetching item track:", error);
        res.status(500).json({ error: "Failed to retrieve item track" });
    }
};

exports.postItem = async (req, res) => {
    const { itemId, fromLocateId, toLocateId, quantity, moveDate } = req.body;

    if (!itemId || !fromLocateId || !toLocateId || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const newTrack = await prisma.itemTrack.create({
            data: {
                itemId,
                fromLocateId,
                toLocateId,
                quantity,
                moveDate: moveDate ? new Date(moveDate) : undefined
            }
        });
        res.status(201).json(newTrack);
    } catch (error) {
        console.error("Error creating item track:", error);
        res.status(500).json({ error: "Failed to create item track" });
    }
};

exports.editItem = async (req, res) => {
    const moveId = parseInt(req.params.id);
    if (isNaN(moveId)) return res.status(400).json({ error: "Invalid ID" });

    try {
        const updatedTrack = await prisma.itemTrack.update({
            where: { moveId },
            data: req.body,
        });
        res.json(updatedTrack);
    } catch (error) {
        console.error("Error updating item track:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "ItemTrack not found" });
        }
        res.status(500).json({ error: "Failed to update item track" });
    }
};

exports.deleteItem = async (req, res) => {
    const moveId = parseInt(req.params.id);
    if (isNaN(moveId)) return res.status(400).json({ error: "Invalid ID" });

    try {
        const deletedTrack = await prisma.itemTrack.delete({ where: { moveId } });
        res.json(deletedTrack);
    } catch (error) {
        console.error("Error deleting item track:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "ItemTrack not found" });
        }
        res.status(500).json({ error: "Failed to delete item track" });
    }
};