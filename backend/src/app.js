// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import profileRoutes from "./routes/profile.routes.js";
import postRoutes from "./routes/post.routes.js";

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

// Profile routes
app.use("/profiles", profileRoutes);

// Post routes
app.use("/posts", postRoutes);

export default app;


