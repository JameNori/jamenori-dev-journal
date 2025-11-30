import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import profileRoutes from "./routes/profile.routes.js";
import postRoutes from "./routes/post.routes.js";
import authRoutes from "./routes/auth.routes.js";
import sql from "./db/db.js";

// Load environment variables
dotenv.config();

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Default health check route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Auth routes
app.use("/auth", authRoutes);

// Profile routes
app.use("/profiles", profileRoutes);

// Post routes
app.use("/posts", postRoutes);

// ทดสอบการเชื่อมต่อฐานข้อมูล
app.get("/test-db", async (req, res) => {
  try {
    const result = await sql`SELECT NOW() AS current_time`;
    return res.status(200).json({
      success: true,
      message: "Database connected successfully!",
      time: result[0].current_time,
    });
  } catch (error) {
    console.error("TEST-DB ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

export default app;
