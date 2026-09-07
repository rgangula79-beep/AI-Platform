import express from "express";
import cors from "cors";
import passport from "passport";
import path from "path";
import fs from "fs";

import { env } from "./config/env.js";
import { healthCheck } from "./config/database.js";
import { configurePassport } from "./config/passport.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

configurePassport();

app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: [env.clientUrl, env.adminUrl],
    credentials: false,
  })
);

// Body parsers
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Passport
app.use(passport.initialize());

// Rate limiting
app.use(apiLimiter);

// Upload directory
fs.mkdirSync(path.resolve(env.uploadDir), { recursive: true });

/*
|--------------------------------------------------------------------------
| API ROOT
|--------------------------------------------------------------------------
*/

app.get("/", (_req, res) => {
  res.json({
    success: true,
    name: "AI Platform",
    message: "AI Platform API is running",
    status: "online",
    owner: process.env.OWNER_NAME || "Gangula Rajesh Kumar",
    email: process.env.OWNER_EMAIL || "rgangula79@gmail.com",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/health", async (_req, res) => {
  try {
    await healthCheck();

    res.json({
      success: true,
      status: "ok",
      service: "ai-platform-server",
      database: "connected",
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(503).json({
      success: false,
      status: "database_unavailable",
      database: "disconnected",
      time: new Date().toISOString(),
    });
  }
});

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/search", searchRoutes);

app.use("/api/files", fileRoutes);

app.use("/api/user", userRoutes);

app.use("/api/admin", adminRoutes);

/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(errorMiddleware);

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

app.listen(env.port, () => {
  console.log("");
  console.log("======================================");
  console.log("       AI PLATFORM SERVER");
  console.log("======================================");
  console.log(`API:     http://localhost:${env.port}`);
  console.log(`Health:  http://localhost:${env.port}/health`);
  console.log(`Owner:   ${process.env.OWNER_NAME || "Gangula Rajesh Kumar"}`);
  console.log("Status:  ONLINE");
  console.log("======================================");
  console.log("");
});