const purchaseService = require('../services/purchaseService');

exports.getAllPurchases = async (req, res) => {
  const purchases = await purchaseService.getAllPurchases();
  res.json(purchases);
};

exports.getPurchaseById = async (req, res) => {
  const purchase = await purchaseService.getPurchaseById(parseInt(req.params.id));
  res.json(purchase);
};

exports.createPurchase = async (req, res) => {
  try {
    const { itemID, vendorID, quantity } = req.body;
    if (!itemID || !vendorID || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPurchase = await purchaseService.createPurchase(req.body);
    res.status(201).json(newPurchase);
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({ error: "Failed to create purchase" });
  }
};

exports.updatePurchaseStatus = async (req, res) => {
  const updated = await purchaseService.updatePurchaseStatus(parseInt(req.params.id), req.body.status);
  res.json(updated);
};

exports.deletePurchase = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID tidak valid" });
    }

    const deletedPurchase = await purchaseService.deletePurchase(id);
    res.json({ message: "Purchase deleted successfully", data: deletedPurchase });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({ error: "Failed to delete purchase" });
  }
};
