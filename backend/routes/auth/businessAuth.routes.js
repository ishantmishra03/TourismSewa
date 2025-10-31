import express from "express";
import {
  registerBusiness,
  logoutBusiness,
  getBusinessProfile,
  loginBusiness,
} from "../../controllers/auth/businessAuth.controller.js";
import { businessAuthMiddleware } from "../../middlewares/businessAuthMiddleware.js";
const businessAuthRouter = express.Router();

businessAuthRouter.post("/register", registerBusiness);
businessAuthRouter.post("/login", loginBusiness);
businessAuthRouter.post("/logout", businessAuthMiddleware, logoutBusiness);
businessAuthRouter.get("/", businessAuthMiddleware, getBusinessProfile);

export default businessAuthRouter;
