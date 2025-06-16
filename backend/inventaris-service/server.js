const express = require('express');
const app = express();
const dotenv = require('dotenv');
const itemRoutes = require('./routes/itemRoutes');

dotenv.config();

app.use(express.json());
app.use('/items', itemRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Inventaris-service running on port ${PORT}`);
});
