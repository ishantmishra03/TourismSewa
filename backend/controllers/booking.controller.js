import Booking from "../models/Booking.js";
import Experience from "../models/Experience.js";

// Create booking
export const createBooking = async (req, res) => {
  try {
    const {
      tourist,
      experience,
      date,
      message,
      contactNumber,
      email,
      noOfPersons,
      totalAmount,
      status,
    } = req.body;

    if (
      !tourist ||
      !experience ||
      !date ||
      !contactNumber ||
      !email ||
      !noOfPersons
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Find the experience and check availability
    const experienceMain = await Experience.findById(experience);
    if (!experienceMain?.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This experience is not available at the moment",
      });
    }

    const calculatedTotalAmount =
      totalAmount ?? experienceMain.pricePerPerson * noOfPersons;

    const bookingStatus = status ?? "pending";

    const booking = new Booking({
      tourist,
      experience,
      date,
      message,
      contactNumber,
      email,
      noOfPersons,
      totalAmount: calculatedTotalAmount,
      status: bookingStatus,
    });

    await booking.save();

    res
      .status(201)
      .json({ success: true, booking, message: "Booking successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all bookings (for tourist)
export const getBookings2 = async (req, res) => {
  try {
    const userId = req.userId; // assumes middleware sets this

    const bookings = await Booking.find({ tourist: userId })
      .populate("tourist", "username email")
      .populate("experience", "name description pricePerPerson");

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all bookings (for business owner)
export const getBookings = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing businessId" });
    }

    const bookings = await Booking.find({})
      .populate("tourist", "username email")
      .populate({
        path: "experience",
        select: "name description business",
        match: { business: businessId },
      });

    // Filter out bookings where experience is null
    const filteredBookings = bookings.filter((b) => b.experience !== null);

    res.json({ success: true, bookings: filteredBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("tourist", "username email")
      .populate("experience", "name description");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete booking by ID
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "confirmed", "canceled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status value. Allowed values are 'pending', 'confirmed', or 'canceled'.",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      booking,
      message: "Booking status updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
