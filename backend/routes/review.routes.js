import express from "express";
import {
  createReview,
  getReviews,
  getReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/", getReviews);
router.get("/:id", getReview);
router.post("/", authMiddleware, createReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
