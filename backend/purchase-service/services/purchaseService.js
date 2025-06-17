const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

// Ambil semua pembelian
exports.getAllPurchases = () => {
  return prisma.purchase.findMany({
    include: {
      item: true,
      vendor: true,
    },
  });
};

// Ambil pembelian berdasarkan ID
exports.getPurchaseById = (id) => {
  if (!id || isNaN(id)) {
    throw new Error("ID pembelian tidak valid, sayang 😢");
  }

  return prisma.purchase.findUnique({
    where: { buyID: id },
    include: {
      item: true,
      vendor: true,
    },
  });
};

// Buat pembelian baru
exports.createPurchase = ({ itemID, vendorID, quantity, totPrice, status }) => {
  if (
    itemID === undefined ||
    vendorID === undefined ||
    quantity === undefined ||
    totPrice === undefined ||
    status === undefined
  ) {
    throw new Error("Data pembelian tidak lengkap, sayang 😿");
  }

  return prisma.purchase.create({
    data: {
      itemID: parseInt(itemID),
      vendorID: parseInt(vendorID),
      quantity: parseInt(quantity),
      totPrice: new Prisma.Decimal(totPrice),
      status,
    },
  });
};

// Update status pembelian
exports.updatePurchaseStatus = (id, status) => {
  if (!id || !status) {
    throw new Error("ID dan status tidak boleh kosong ya, cintaku 💌");
  }

  return prisma.purchase.update({
    where: { buyID: id },
    data: { status },
  });
};
