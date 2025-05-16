import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    roles: [
      {
        type: String,
        enum: ["Leadership", "Consultancy", "Design", "Construction"]
      }
    ],
    bio: { type: String, required: true },
    image: { type: String, required: true }, // Image URL from Cloudinary
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
      whatsapp: { type: String }
    },
    isActive: { type: Boolean, default: true } // To activate or deactivate the team member
  },
  { timestamps: true } // To automatically add createdAt and updatedAt
);

export default mongoose.model("TeamMember", TeamMemberSchema);
