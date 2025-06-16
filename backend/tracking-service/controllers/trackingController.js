const { PrismaClient } = require("@prisma/client");
const mqttClient = require('../configs/mqttClient');

const prisma = new PrismaClient();