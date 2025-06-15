const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Rate Limiting Middleware (misal: max 10 req per menit per IP)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 10,
  message: "Terlalu banyak request, coba lagi nanti",
});

app.use(limiter);

// Proxy routes
app.use(
    "/api/auth",
    createProxyMiddleware({
        target: "http://localhost:3001", // auth-service
    changeOrigin: true,
    })
);

app.use(
    "/api/inventaris",
    createProxyMiddleware({
        target: "http://localhost:3002", // inventaris-service
        changeOrigin: true,
    })
);

app.use(
    "/api/notification-service",
    createProxyMiddleware({
        target: "http://localhost:3003", // inventaris-service
        changeOrigin: true,
    })
);

app.use(
    "/api/purchase-service",
    createProxyMiddleware({
        target: "http://localhost:3004", // inventaris-service
        changeOrigin: true,
})
);

app.use(
    "/api/tracking-service",
    createProxyMiddleware({
        target: "http://localhost:3005", // inventaris-service
        changeOrigin: true,
    })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚪 API Gateway berjalan di http://localhost:${PORT}`);
});