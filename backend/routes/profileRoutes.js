import express from "express";
import profileRouter from "./profile.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getRecommendations } from "./controllers/recommendationController.js";

const router = express.Router();

router.use("/profiles", profileRouter);

// Add recommendations route with auth middleware
router.get("/profiles/:id/recommendations", authMiddleware, getRecommendations);

export default router;
