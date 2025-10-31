import Business from "../models/Business.js";

// Get all businesses
export const getBusinesses = async (_req, res) => {
  try {
    const businesses = await Business.find({});
    if (!businesses || businesses.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No business found" });
    }

    res.status(200).json({ success: true, businesses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get business by ID
export const getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id);
    if (!business) {
      return res
        .status(400)
        .json({ success: false, message: "No business found" });
    }

    res.status(200).json({ success: true, business });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
