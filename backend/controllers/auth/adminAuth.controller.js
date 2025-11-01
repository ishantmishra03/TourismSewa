import { generateToken } from "../../utils/generateToken.js";

const { ADMIN_EMAIL, ADMIN_PASS, NODE_ENV } = process.env;

// Admin Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (password !== ADMIN_PASS) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token (can be admin ID or email)
    const token = generateToken("admin");

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        user: { id: 1, name: ADMIN_EMAIL },
        message: "Admin login successful",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin Logout
export const logout = (_req, res) => {
  res
    .cookie("token", "", { maxAge: 0 })
    .json({ success: true, message: "Admin logged out successfully" });
};

// Get profile
export const getUserProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: 1,
        name: ADMIN_EMAIL,
        // email: user.email,
        // contactNumber: user.contactNumber,
        // nationality: user.nationality,
        // gender: user.gender,
      },
      message: "Authenticated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
