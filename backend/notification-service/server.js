// notification-service/server.js
const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.use(express.json());

app.use("/api/notification", require("./routes/notificationRoutes"));

/*
    Port Exposure
*/
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));