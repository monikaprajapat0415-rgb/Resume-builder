import mongoose from "mongoose";

// A comment / feedback note a signed-in reader leaves under a tutorial lesson.
const LessonFeedbackSchema = new mongoose.Schema({
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },   // display name (first name only)
    rating: { type: Number, min: 1, max: 5 },                             // optional "was this lesson helpful" stars
    text: { type: String, required: true, trim: true, minlength: 3, maxlength: 1000 },
    status: { type: String, enum: ['visible', 'hidden'], default: 'visible', index: true },
}, { timestamps: true });

LessonFeedbackSchema.index({ lesson: 1, status: 1, createdAt: -1 });

export default mongoose.model("LessonFeedback", LessonFeedbackSchema);
