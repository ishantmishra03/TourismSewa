import Review from "../models/Review.js";
import Experience from "../models/Experience.js";

export const createReview = async (req, res) => {
  try {
    const { experienceId, rating, comment } = req.body;
    if (!experienceId || !rating)
      return res.status(400).json({ error: "Experience and rating required." });

    const experience = await Experience.findById(experienceId);
    if (!experience)
      return res.status(404).json({ error: "Experience not found." });

    const existingReview = await Review.findOne({
      tourist: req.user._id,
      experience: experienceId,
    });
    if (existingReview)
      return res
        .status(400)
        .json({ error: "You have already reviewed this experience." });

    const review = await Review.create({
      tourist: req.user._id,
      experience: experienceId,
      rating,
      comment,
      isApproved: false,
    });
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

export const getReviews = async (req, res) => {
  try {
    const filter = req.query.experienceId
      ? { experience: req.query.experienceId, isApproved: true }
      : { isApproved: true };
    const reviews = await Review.find(filter)
      .populate("tourist", "username email")
      .populate("experience", "name location");
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

export const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("tourist", "username email")
      .populate("experience", "name location");
    if (!review) return res.status(404).json({ error: "Review not found." });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found." });

    if (
      !req.user.isAdmin &&
      review.tourist.toString() !== req.user._id.toString()
    )
      return res.status(403).json({success: false, error: "Not authorized." });

    await review.deleteOne();
    res.json({ success: true, message: "Review deleted." });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};
