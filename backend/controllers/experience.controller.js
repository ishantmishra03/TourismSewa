import Experience from "../models/Experience.js";
import Business from "../models/Business.js";
import imagekit from "../utils/imageKit.js";
import { GroqService } from "../services/ai.service.js";

// Create a new Experience
export const createExperience2 = async (req, res) => {
  try {
    const {
      name,
      description,
      coordinates,
      type,
      businessId,
      location,
      duration,
      pricePerPerson,
    } = req.body;
    const file = req.file;

    if (
      !name ||
      !description ||
      !coordinates ||
      !file ||
      !businessId ||
      !location ||
      !duration ||
      !pricePerPerson
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields (name, description, coordinates, image, businessId, location, duration, pricePerPerson)",
      });
    }

    // Check if business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }

    // Upload image to ImageKit
    const uploadResult = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });

    const imageUrl = uploadResult.url;

    const experience = new Experience({
      name,
      description,
      coordinates: JSON.parse(coordinates),
      location,
      image: imageUrl,
      type,
      business: business._id,
      duration,
      pricePerPerson,
    });

    await experience.save();

    res.status(201).json({ success: true, experience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all experiences
export const getExperiences = async (_req, res) => {
  try {
    const experiences = await Experience.find({}).populate("business");
    res.json({ success: true, experiences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get featured experiences
export const getFeaturedExperiences = async (_req, res) => {
  try {
    const experiences = await Experience.find({}).limit(6).populate("business");
    res.json({ success: true, experiences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all experiences (for business owners)
export const getExperiences2 = async (req, res) => {
  try {
    const { id } = req.params;
    const experiences = await Experience.find({ business: id }).populate(
      "business"
    );
    res.json({ success: true, experiences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single experience by ID
export const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id).populate("business");

    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });
    }

    res.json({ success: true, experience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update experience by ID
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.businessId) {
      const business = await Business.findById(updates.businessId);
      if (!business) {
        return res
          .status(404)
          .json({ success: false, message: "Business not found" });
      }
      updates.business = business._id;
      delete updates.businessId;
    }

    const experience = await Experience.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("business");

    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });
    }

    res.json({ success: true, experience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete experience by ID
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });
    }

    res.json({ success: true, message: "Experience deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Search handler
export const searchHandler = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    // Step 1: Try normal keyword search
    let experiences = await Experience.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ],
    }).populate("business");

    // Step 2: If no matches, fallback to AI
    if (experiences.length === 0) {
      const allExperiences = await Experience.find({})
        .populate("business")
        .lean();

      // Prepare a system prompt
      const systemPrompt = `
You are a helpful assistant that suggests tourism experiences based on user queries.
The user searched for: "${q}"
Here are all available experiences:
${JSON.stringify(allExperiences)}
Return the 3–5 most relevant experiences as JSON array with all their fields. Just return json array no any other text.
`;

      const aiResponse = await GroqService.chat({
        system: systemPrompt,
        user: q,
        temperature: 0.7,
        max_tokens: 2000,
      });

      try {
        // console.log("AI response:", aiResponse);
        // AI is expected to return a JSON array string
        experiences = aiResponse;
      } catch (err) {
        console.error("AI JSON parse error:", err);
        // fallback: return all experiences if parsing fails
        experiences = [];
      }
    }

    res.json({ success: true, experiences });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
