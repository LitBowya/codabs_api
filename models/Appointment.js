import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    reasonForRejection: { type: String },
    message: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Appointment", AppointmentSchema);
