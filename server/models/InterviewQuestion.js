import mongoose from "mongoose";

// An interview question with a model answer written by us. Readers add their own answers (InterviewAnswer).
const InterviewQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: 'General' },         // e.g. "HR & behavioural", "SQL", "Warehouse"
    level: { type: String, enum: ['fresher', 'experienced', 'both'], default: 'both' },
    modelAnswer: { type: String, default: '' },              // plain text, blank lines separate paragraphs
    tips: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    learnCourse: { type: String, default: '' },              // optional: slug of a course that teaches this topic
    learnLesson: { type: String, default: '' },              // optional: slug of the lesson in that course (blank = link to the course)
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    modifiedAt: { type: Date },
}, { timestamps: true });
InterviewQuestionSchema.index({ published: 1, level: 1, category: 1 });

export default mongoose.model("InterviewQuestion", InterviewQuestionSchema);
