const { PrismaClient } = require("@prisma/client");
const mqttClient = require('../configs/mqttClient');

const prisma = new PrismaClient();

exports.viewAll = async (req, res) => {
    const items = await prisma.item.findMany();
    res.json(items);
}

exports.viewItem = async (req, res) => {
    const item = await prisma.item.findUnique({ where: { itemID: parseInt(req.params.id) } });
    res.json(item);
}

exports.postItem = async (req, res) => {
    const item = await prisma.item.create({ data: req.body });
    res.json(item);
}

exports.editItem = async (req, res) => {
    const item = await prisma.item.update({ where: { itemID: parseInt(req.params.id) }, data: req.body });
    res.json(item);
}

exports.deleteItem = async (req, res) => {
    const item = await prisma.item.delete({ where: { itemID: parseInt(req.params.id) } });
    res.json(item);
}