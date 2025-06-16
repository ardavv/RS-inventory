// tracking-service/server.js
const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.use(express.json());

app.use("/api/tracking", require("./routes/trackingRoutes"));

/*
    Port Exposure
*/
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));