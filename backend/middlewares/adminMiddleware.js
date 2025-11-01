import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Not a authorized user",
      });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
