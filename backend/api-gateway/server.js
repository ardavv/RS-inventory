const express = require("express");
const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// --- KONFIGURASI APLIKASI ---

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1);
}

// --- KONFIGURASI MICROSERVICES ---
// Memusatkan konfigurasi untuk kemudahan pengelolaan.
const services = [
  {
    route: "/api/auth",
    target: "http://localhost:3001",
    auth: false, // Tidak memerlukan autentikasi
  },
  {
    route: "/api/inventaris",
    target: "http://localhost:3002",
    auth: true, // Memerlukan autentikasi
  },
  {
    route: "/api/notification",
    target: "http://localhost:3003",
    auth: true,
  },
  {
    route: "/api/purchase",
    target: "http://localhost:3004",
    auth: true,
  },
  {
    route: "/api/tracking",
    target: "http://localhost:3005",
    auth: true,
  },
];

// --- MIDDLEWARE ---

// 1. Middleware untuk parsing body JSON
app.use(express.json());

// 2. Middleware untuk Rate Limiting
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 menit
    max: 100, // Maksimal 100 request per IP per menit
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/**
 * Middleware untuk memverifikasi JWT dari header Authorization.
 * Jika token valid, informasi user akan ditambahkan ke `req.user`.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // Tidak ada token, tetapi biarkan proxy yang menentukan
    // apakah rute ini publik atau tidak.
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Menyimpan payload token (misal: { id: 'user-id', role: 'admin' })
  } catch (error) {
    // Jika token ada tapi tidak valid (misal: kadaluarsa atau salah)
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  next();
};

app.use(authenticateToken);

// --- PROXY SETUP ---

console.log("🚀 Setting up API Gateway proxies...");

services.forEach(({ route, target, auth }) => {
  // Opsi untuk proxy middleware
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "", // Menghapus prefix rute, misal: /api/inventaris/items -> /items
    },
    on: {
      /**
       * Menangani event sebelum request di-proxy.
       * Di sini kita menambahkan header dan melakukan pengecekan autentikasi.
       */
      proxyReq: (proxyReq, req, res) => {
        // Jika rute ini memerlukan autentikasi TAPI user tidak terautentikasi (req.user tidak ada)
        if (auth && !req.user) {
          res
            .status(401)
            .json({ error: "Unauthorized: Access token is required." });
          // Menghentikan request agar tidak di-proxy
          return proxyReq.destroy();
        }

        // Jika user terautentikasi, teruskan ID-nya ke microservice
        if (req.user) {
          proxyReq.setHeader("x-user-id", req.user.id);
          console.log(
            `[GATEWAY] User ${req.user.id} -> ${req.method} ${req.path}`
          );
        } else {
          console.log(`[GATEWAY] Public Request -> ${req.method} ${req.path}`);
        }

        // Fix untuk body request agar tidak hilang saat di-proxy
        if (req.body) {
          fixRequestBody(proxyReq, req);
        }
      },
      /**
       * Menangani error saat proxy berjalan.
       * Contoh: microservice tujuan sedang down.
       */
      error: (err, req, res) => {
        console.error(`[GATEWAY] Proxy error for ${req.path}:`, err.message);

        // Periksa apakah header sudah terkirim sebelum mencoba mengirim
        if (!res.headersSent) {
          res.status(502).json({
            error: "Bad Gateway: The service is temporarily unavailable.",
          });
        }
      },
    },
  };

  app.use(route, createProxyMiddleware(proxyOptions));
  console.log(`-> Proxied ${route} to ${target} (Auth required: ${auth})`);
});

// --- HEALTH CHECK ---

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// --- SERVER START ---

app.listen(PORT, () => {
  console.log(
    `✅ API Gateway is running and listening on http://localhost:${PORT}`
  );
});
