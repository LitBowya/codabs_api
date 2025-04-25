import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },
    roles: {
      type: [String],
      enum: ["admin", "editor", "viewer", "superadmin"],
      default: ["viewer"],
    },
    userId: { type: Number, required: true },
    phone: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
