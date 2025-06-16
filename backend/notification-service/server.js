// notification-service/server.js
const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

/*
    RabbidMQ Init
*/
const { connectRabbitMQ } = require('./configs/rabbidmq');
connectRabbitMQ();

/*
    Express Uses
*/
app.use(express.json());
app.use("/api/notification", require("./routes/notificationRoutes"));

/*
    Port Exposure
*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));