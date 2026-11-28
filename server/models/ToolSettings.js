import mongoose from "mongoose";

// One document of on/off switches for the free tools, edited at Admin > Free tools.
const ToolSettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    imageEnhancer: { type: Boolean, default: true },   // the Image Enhancer (/products/image-enhancer)
    enhancerDailyLimit: { type: Number, default: 10, min: 1, max: 500 }, // free enhancements per signed-in user per day (admins are not limited)
    coverLetterTool: { type: Boolean, default: true },   // /tools/cover-letter-generator
    bulletTool: { type: Boolean, default: true },        // /tools/resume-bullet-improver
    interviewTool: { type: Boolean, default: true },     // /tools/mock-interview-practice
    offerTool: { type: Boolean, default: true },         // /tools/job-offer-comparison (no AI, runs in the browser)
    timedRoundTool: { type: Boolean, default: true },    // /products/timed-interview-round
    swiftReaderTool: { type: Boolean, default: true },   // /products/swift-code-reader
    mergePdfTool: { type: Boolean, default: true },      // /products/merge-pdf (runs in the browser)
    splitPdfTool: { type: Boolean, default: true },      // /products/split-pdf (runs in the browser)
    reducePdfTool: { type: Boolean, default: true },     // /products/reduce-pdf-size (runs in the browser)
    photoResizerTool: { type: Boolean, default: true },  // /products/photo-signature-resizer (runs in the browser)
    trackerTool: { type: Boolean, default: true },       // the Applications board in the signed-in dashboard
    trackerMaxPerUser: { type: Number, default: 200, min: 10, max: 2000 }, // jobs one user can keep on the board
    planTool: { type: Boolean, default: true },          // 'Make my study plan' box on roadmap pages
    playgroundTool: { type: Boolean, default: true },    // /products/code-playground
    linkedinTool: { type: Boolean, default: true },      // /tools/linkedin-headline-about-generator
    careerDailyLimit: { type: Number, default: 10, min: 1, max: 200 }, // AI uses of the career tools per signed-in user per day, all tools together (admins are not limited)
    enhancerMode: { type: String, enum: ['pro', 'standard'], default: 'pro' }, // mode the page starts on
}, { timestamps: true });

export default mongoose.model("ToolSettings", ToolSettingsSchema);
