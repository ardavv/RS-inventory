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
  try {
    // 1. Ambil user ID dari header
    const userId = req.headers["x-user-id"];

    // Jika tidak ada user ID, kirim error (opsional tapi direkomendasikan)
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing." });
    }

    // 2. Gabungkan data dari body dengan `createdBy`
    const itemData = {
      ...req.body,
      createdBy: userId, // Tambahkan ID user ke field `createdBy`
    };

    // 3. Panggil service untuk membuat item dengan data yang sudah lengkap
    const newItem = await itemService.create(itemData);

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Failed to create item." });
  }
};

exports.updateItem = async (req, res) => {
  const item = await itemService.update(parseInt(req.params.id), req.body);
  res.json(item);
};

exports.deleteItem = async (req, res) => {
  await itemService.delete(parseInt(req.params.id));
  res.status(204).send();
};
