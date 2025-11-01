import express from "express";
import {
  createReview,
  getReviews,
  getReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const reviewRouter = express.Router();

reviewRouter.get("/", getReviews);
reviewRouter.get("/:id", getReview);
reviewRouter.post("/", authMiddleware, createReview);
reviewRouter.delete("/:id", authMiddleware, deleteReview);

export default reviewRouter;
