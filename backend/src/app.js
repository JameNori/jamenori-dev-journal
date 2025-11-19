import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import profileRoutes from "./routes/profile.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Register profile routes
app.use("/profiles", profileRoutes);

export default app;

