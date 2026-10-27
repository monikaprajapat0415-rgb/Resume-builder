import mongoose from "mongoose";

// How many times a signed-in user used a tool on a day (for the daily limit). Only a count is kept: never the images.
const ToolUsageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tool: { type: String, required: true },
    day: { type: String, required: true },          // YYYY-MM-DD (UTC)
    count: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 14 }, // rows clean themselves up after 14 days
});
ToolUsageSchema.index({ user: 1, tool: 1, day: 1 }, { unique: true });

export default mongoose.model("ToolUsage", ToolUsageSchema);
