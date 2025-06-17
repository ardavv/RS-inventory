const express = require('express');
const router = express.Router();
const controller = require('../controllers/purchaseController');

router.get('/', controller.getAllPurchases);
router.get('/:id', controller.getPurchaseById);
router.post('/', controller.createPurchase);
router.put('/:id', controller.updatePurchaseStatus);
router.delete('/:id', controller.deletePurchase);

module.exports = router;
