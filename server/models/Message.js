import mongoose from "mongoose";

// A message submitted through the public Contact Us form.
const MessageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Message", MessageSchema);
