import Business from "../../models/Business.js";
import { generateToken } from "../../utils/generateToken.js";
import bcrypt from "bcryptjs";

// Business Signup
export const registerBusiness = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      businessName,
      contactNumber,
      address,
      description,
      categories,
    } = req.body;

    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res
        .status(400)
        .json({ success: false, message: "Business already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const business = await Business.create({
      name,
      email,
      password: hashedPassword,
      businessName,
      contactNumber,
      address,
      description,
      categories,
      verified: false,
    });

    const token = generateToken(business._id.toString());

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        user: {
          id: business._id,
          name: business.name,
        },
        message: "Business registered successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Business Login
export const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await Business.findOne({ email });
    if (!business) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(business._id.toString());

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        user: {
          id: business._id,
          name: business.name,
        },
        message: "Login successful",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Business Logout
export const logoutBusiness = (_req, res) => {
  res
    .cookie("token", "", { maxAge: 0 })
    .json({ success: true, message: "Logged out successfully" });
};

// Get Business Profile
export const getBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.businessId);
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }

    res.json({
      success: true,
      user: {
        id: business._id,
        name: business.name,
        // Uncomment any fields you need below:
        // businessName: business.businessName,
        // email: business.email,
        // contactNumber: business.contactNumber,
        // address: business.address,
        // description: business.description,
        // categories: business.categories,
        // verified: business.verified,
      },
      message: "Authenticated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
