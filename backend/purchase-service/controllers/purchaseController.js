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
  const newPurchase = await purchaseService.createPurchase(req.body);
  res.json(newPurchase);
};

exports.updatePurchaseStatus = async (req, res) => {
  const updated = await purchaseService.updatePurchaseStatus(parseInt(req.params.id), req.body.status);
  res.json(updated);
};