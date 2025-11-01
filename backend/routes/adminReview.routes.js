import express from "express";
import {
  getPendingReviews,
  approveReview,
  rejectReview,
} from "../controllers/adminReview.controller.js";
// import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const adminReviewRouter = express.Router();

adminReviewRouter.get("/pending", getPendingReviews);
adminReviewRouter.patch("/:id/approve", approveReview);
adminReviewRouter.delete("/:id", rejectReview);

export default adminReviewRouter;
