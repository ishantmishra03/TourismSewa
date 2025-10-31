import express from "express";
import {
  getBusinessById,
  getBusinesses,
} from "../controllers/business.controller.js";

const businessRouter = express.Router();

businessRouter.get("/", getBusinesses);
businessRouter.get("/:id", getBusinessById);

export default businessRouter;
