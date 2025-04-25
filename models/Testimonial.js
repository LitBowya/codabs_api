import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    image: {
      type: String, // Cloudinary URL or fallback default
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
    isApproved: {
      type: Boolean,
      default: false, // Testimonials must be approved before being public
    },
  },
  { timestamps: true },
);

export default mongoose.model("Testimonial", TestimonialSchema);
