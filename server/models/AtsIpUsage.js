import mongoose from "mongoose";

// Free ATS checks used from one network address in the current window. The address is
// stored only as a salted hash. Stops one person farming free checks with many accounts.
const AtsIpUsageSchema = new mongoose.Schema({
    ipHash: { type: String, required: true, unique: true },
    freeUsed: { type: Number, default: 0 },
    windowStart: { type: Date, default: Date.now },
}, { timestamps: true });

// Rows disappear on their own a while after the window ends.
AtsIpUsageSchema.index({ windowStart: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 14 });

export default mongoose.model("AtsIpUsage", AtsIpUsageSchema);
