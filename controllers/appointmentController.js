import Appointment from "../models/Appointment.js";
import { format, parseISO } from "date-fns";
import { receiveEmail, sendEmail } from "../utils/sendEmail.js";

// Helper to check for time overlap
const hasConflict = (appointments, newDate) => {
  return appointments.some((app) => {
    const timeDiff = Math.abs(new Date(app.date) - newDate) / (1000 * 60 * 60);
    return timeDiff < 2;
  });
};

// CREATE APPOINTMENT
export const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, date, message } = req.body;
    const appointmentDate = new Date(date);

    const sameDayAppointments = await Appointment.find({
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      }
    });

    if (sameDayAppointments.length >= 3) {
      return res.status(400).json({
        success: false,
        message: "Only 3 appointments are allowed per day."
      });
    }

    if (hasConflict(sameDayAppointments, new Date(date))) {
      return res.status(400).json({
        success: false,
        message:
          "Sorry, we're unable to schedule your appointment at this time. Please choose a different time—appointments must be at least 2 hours apart to allow for adequate preparation."
      });
    }

    const dt = typeof date === "string" ? parseISO(date) : date;
    const formatted = format(dt, "MMMM d, yyyy 'at' h:mm a");

    const subject = `New appointment requested for ${formatted}`;

    await receiveEmail({ name, phone, from: email, subject, message });

    const newAppointment = await Appointment.create({
      name,
      email,
      phone,
      date: dt,
      message
    });

    res.status(201).json({
      success: true,
      message: "Appointment request sent successfully",
      appointment: newAppointment
    });
  } catch (error) {
    console.error("Appointment Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ADMIN: ACCEPT
export const acceptAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ success: false, message: "Not found" });

    appointment.status = "accepted";
    await appointment.save();

    await sendEmail({
      to: appointment.email,
      subject: "Your Appointment Has Been Accepted 🎉",
      text: `Dear ${appointment.name},

We are pleased to inform you that your appointment scheduled for ${appointment.date.toLocaleString()} has been successfully accepted.

Our team is looking forward to speaking with you and addressing your needs. If you have any additional information or documents you'd like to share before the meeting, feel free to reply to this email.

✨ Please ensure you’re available on time. If anything changes, kindly notify us in advance.

Thank you for choosing CODABS. We’re excited to connect with you soon!

Warm regards,  
The CODABS Team 🏗️`
    });

    res.status(200).json({ success: true, message: "Appointment accepted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: REJECT
export const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reasonForRejection } = req.body;

    if (!reasonForRejection) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        reasonForRejection: reasonForRejection
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      appointment: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL APPOINTMENTS
export const getAllAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      search,
      status,
      dateFrom,
      dateTo,
      sortField = "createdAt",
      sortOrder = -1
    } = req.query;

    // Build query object
    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }

    // Status filter
    if (status && ["pending", "accepted", "rejected"].includes(status)) {
      query.status = status;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    // Sorting
    const sortOptions = {};
    const sortFieldParam = sortField || "createdAt";
    sortOptions[sortFieldParam] = sortOrder === "asc" ? 1 : -1;

    // Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query
    const appointments = await Appointment.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    // Get total count for pagination
    const total = await Appointment.countDocuments(query);
    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      totalPages,
      remaining: total - pageNumber * limitNumber,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// TOGGLE AVAILABILITY
export const toggleAvailability = async (req, res) => {
  try {
    let availabilityDoc = await Appointment.findOne({
      isAvailable: { $in: [true, false] }
    });

    if (!availabilityDoc) {
      availabilityDoc = await Appointment.create({
        name: "-",
        email: "-",
        phone: "-",
        date: new Date(),
        isAvailable: false
      });
    }

    availabilityDoc.isAvailable = !availabilityDoc.isAvailable;
    await availabilityDoc.save();

    res.status(200).json({
      success: true,
      message: `Availability set to ${availabilityDoc.isAvailable}`,
      isAvailable: availabilityDoc.isAvailable
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET CURRENT AVAILABILITY
export const getAvailability = async (req, res) => {
  try {
    const availabilityDoc = await Appointment.findOne({
      isAvailable: { $in: [true, false] }
    });

    res.status(200).json({
      success: true,
      isAvailable: availabilityDoc ? availabilityDoc.isAvailable : false
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
