import express from "express";
import {
  getUserProfile,
  login,
  logout,
} from "../../controllers/auth/adminAuth.controller.js";
const adminAuthRouter = express.Router();

adminAuthRouter.get("/", getUserProfile);
adminAuthRouter.post("/login", login);
adminAuthRouter.post("/logout", logout);

export default adminAuthRouter;
