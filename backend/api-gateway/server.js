const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many requests",
  })
);

// Auth Middleware
const authenticate = async (req, res, next) => {
  // Skip auth untuk endpoint login/register
//   if (
//     req.path.includes("/api/auth/login") ||
//     req.path.includes("/api/auth/register")
//   ) {
//     return next();
//   }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Verifikasi ke auth-service
    // await axios.get(`http://localhost:3001/api/auth/verify`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Apply auth middleware ke semua route kecuali auth
app.use(
  ["/api/inventaris", "/api/notification", "/api/purchase", "/api/tracking"],
  authenticate
);

// Proxy Configuration
const services = {
  "/api/auth": "http://localhost:3001",
  "/api/inventaris": "http://localhost:3002",
  "/api/notification": "http://localhost:3003",
  "/api/purchase": "http://localhost:3004",
  "/api/tracking": "http://localhost:3005",
};

Object.entries(services).forEach(([route, target]) => {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${route}`]: "" },
      on: {
        proxyReq: (proxyReq, req) => {
          // Forward user data ke microservices
          if (req.user) {
            proxyReq.setHeader("X-User-Id", req.user.id);
            console.log(`[Gateway] Proxying ${req.url} -> ${target}`); // Debug
          }
        },
      },
    })
  );
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});
