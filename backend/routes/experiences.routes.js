import express from "express";
import multer from "../config/multer.js";
import {
  createExperience2,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  getExperiences2,
  getFeaturedExperiences,
  searchHandler,
} from "../controllers/experience.controller.js";

const experienceRouter = express.Router();

experienceRouter.post("/", multer.single("image"), createExperience2);
experienceRouter.get("/", getExperiences);
experienceRouter.get("/featured", getFeaturedExperiences);
experienceRouter.get("/search", searchHandler);
experienceRouter.get("/2/:id", getExperiences2);
experienceRouter.get("/:id", getExperienceById);
experienceRouter.put("/:id", multer.single("image"), updateExperience);
experienceRouter.delete("/:id", deleteExperience);

export default experienceRouter;
