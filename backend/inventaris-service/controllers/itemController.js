const itemService = require('../services/itemService');

exports.getAllItems = async (req, res) => {
  const items = await itemService.getAll();
  res.json(items);
};

exports.getItemById = async (req, res) => {
  const item = await itemService.getById(parseInt(req.params.id));
  res.json(item);
};

exports.createItem = async (req, res) => {
  const item = await itemService.create(req.body);
  res.status(201).json(item);
};

exports.updateItem = async (req, res) => {
  const item = await itemService.update(parseInt(req.params.id), req.body);
  res.json(item);
};

exports.deleteItem = async (req, res) => {
  await itemService.delete(parseInt(req.params.id));
  res.status(204).send();
};
