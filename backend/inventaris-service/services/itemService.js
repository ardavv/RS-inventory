const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = () => prisma.item.findMany({
  include: { category: true }
});

exports.getById = (id) => prisma.item.findUnique({
  where: { itemID: id },
  include: { category: true }
});

exports.create = (data) => prisma.item.create({ data });

exports.update = (id, data) =>
  prisma.item.update({ where: { itemID: id }, data });

exports.delete = (id) =>
  prisma.item.delete({ where: { itemID: id } });
