// models/Analytics.js
import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["page", "blog", "project", "service"],
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "type"
  },
  ip: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Analytics", analyticsSchema);
