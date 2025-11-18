import express from "express";
import { handleGetProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", handleGetProfile);

export default router;
