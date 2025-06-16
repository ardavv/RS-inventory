const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllPurchases = () => {
  return prisma.purchase.findMany({ include: { item: true, vendor: true } });
};

exports.getPurchaseById = (id) => {
  return prisma.purchase.findUnique({ where: { buyID: id }, include: { item: true, vendor: true } });
};

exports.createPurchase = ({ itemID, vendorID, quantity, totPrice, status }) => {
  return prisma.purchase.create({
    data: { itemID, vendorID, quantity, totPrice, status },
  });
};

exports.updatePurchaseStatus = (id, status) => {
  return prisma.purchase.update({
    where: { buyID: id },
    data: { status },
  });
};