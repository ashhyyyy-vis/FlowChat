// models/Report.ts
import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reporterDeviceId: {
      type: String,
      required: true,
      index: true
    },
    reportedDeviceId: {
      type: String,
      required: true,
      index: true
    },
    sessionId: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      enum: ["harassment", "sexual", "hate", "spam", "other"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-expire reports after 14 days (privacy win)
ReportSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1209600 });

export default mongoose.model("Report", ReportSchema);
