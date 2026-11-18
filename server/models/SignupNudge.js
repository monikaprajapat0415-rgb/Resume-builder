import mongoose from "mongoose";

// One document of settings and counters for the small sign-up card, edited at Admin > Sign-up prompt.
const SignupNudgeSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    enabled: { type: Boolean, default: true },
    onHome: { type: Boolean, default: true },        // home page
    onContent: { type: Boolean, default: false },    // blog, lessons and interview answers
    delaySeconds: { type: Number, default: 20 },     // time on the page before the card can show (a visitor action is also needed)
    hideDays: { type: Number, default: 14 },         // after the card is closed, hide it for this many days
    title: { type: String, default: 'Save your resume for free' },
    body: { type: String, default: 'Create a free account to keep your resume, come back to edit it any time, and download it when it is ready.' },
    button: { type: String, default: 'Create free account' },
    shown: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    dismissed: { type: Number, default: 0 },
    statsSince: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("SignupNudge", SignupNudgeSchema);
