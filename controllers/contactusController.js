import { receiveEmail } from "../utils/sendEmail.js";
import ContactMessage from "../models/Contact.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, telephone, from, subject, message } = req.body;

    if (!name || !telephone || !from || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (name, telephone, from, subject, message) are required",
      });
    }

    // Save the message in the database
    await ContactMessage.create({ name, telephone, from, subject, message });

    // Send email
    await receiveEmail({ name, telephone, from, subject, message });

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully",
    });
  } catch (error) {
    console.error("Send Email Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the message",
      error: error.message,
    });
  }
};
