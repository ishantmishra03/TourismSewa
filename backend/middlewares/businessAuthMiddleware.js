import jwt from "jsonwebtoken";
import Business from "../models/Business.js";

export const businessAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const business = await Business.findById(decoded.id);
    if (!business) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Not a business user" });
    }

    req.businessId = decoded.id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
