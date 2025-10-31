import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {
  getUserProfile,
  login,
  logout,
  register,
} from "../../controllers/auth/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/", authMiddleware, getUserProfile);

export default authRouter;
