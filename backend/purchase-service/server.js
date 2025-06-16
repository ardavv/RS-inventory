const express = require('express');
const bodyParser = require('body-parser');
const purchaseRoutes = require('./routes/purchaseRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use('/', purchaseRoutes);

app.listen(PORT, () => {
  console.log(`Purchase service running on http://localhost:${PORT}`);
});