import Appointment from "../models/Appointment.js";
import { sendEmail } from "../utils/sendEmail.js";

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
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999)),
      },
    });

    if (sameDayAppointments.length >= 3) {
      return res.status(400).json({
        success: false,
        message: "Only 3 appointments are allowed per day.",
      });
    }

    if (hasConflict(sameDayAppointments, new Date(date))) {
      return res.status(400).json({
        success: false,
        message:
          "Sorry, we're unable to schedule your appointment at this time. Please choose a different time—appointments must be at least 2 hours apart to allow for adequate preparation.",
      });
    }

    const newAppointment = await Appointment.create({
      name,
      email,
      phone,
      date,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Appointment request sent successfully",
      appointment: newAppointment,
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
The CODABS Team 🏗️`,
    });

    res.status(200).json({ success: true, message: "Appointment accepted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: REJECT
export const rejectAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ success: false, message: "Not found" });

    appointment.status = "rejected";
    appointment.reasonForRejection = reason;
    await appointment.save();

    await sendEmail({
      to: appointment.email,
      subject: "Appointment Request Update – Not Approved",
      text: `Dear ${appointment.name},

Thank you for your interest in scheduling an appointment with CODABS.

After careful consideration, we regret to inform you that your requested appointment on ${appointment.date.toLocaleString()} could not be accommodated.

Reason: ${reason}

We sincerely apologize for any inconvenience this may cause and encourage you to reschedule at a time that works best for you. Your time is valuable to us, and we’re committed to finding the right opportunity to connect.

If you have any questions or need assistance rescheduling, feel free to reach out.

Warm regards,
The CODABS Team 🏗️`,
    });

    res
      .status(200)
      .json({ success: true, message: "Appointment rejected and email sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL APPOINTMENTS
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
