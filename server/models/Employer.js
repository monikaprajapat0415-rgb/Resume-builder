import mongoose from "mongoose";

// A company that wants to post jobs and contact job seekers who marked themselves available.
// One employer profile per user account. Nothing is visible to seekers until an admin approves it.
const EmployerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true, maxlength: 150, trim: true },
    employerType: { type: String, enum: ['company', 'factory', 'contractor', 'agency', 'individual'], default: 'company' },
    country: { type: String, default: 'IN', maxlength: 3 },
    website: { type: String, default: '', maxlength: 300, trim: true },                 // website OR registrationNo is required
    registrationNo: { type: String, default: '', maxlength: 60, trim: true },           // GST / CIN / Companies House / CAC / trade licence number
    noFeeConfirmedAt: { type: Date },                                                   // pledged never to charge workers a recruitment fee
    workEmail: { type: String, required: true, maxlength: 200, lowercase: true, trim: true },   // company address, shown to the admin
    contactName: { type: String, required: true, maxlength: 100, trim: true },
    contactRole: { type: String, default: '', maxlength: 100, trim: true },
    phone: { type: String, default: '', maxlength: 30, trim: true },
    industry: { type: String, default: '', maxlength: 100, trim: true },
    size: { type: String, default: '', maxlength: 30 },
    location: { type: String, default: '', maxlength: 150, trim: true },
    about: { type: String, default: '', maxlength: 1000, trim: true },       // shown to seekers when a company contacts them
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending', index: true },
    reviewNote: { type: String, default: '', maxlength: 500 },                // shown to the company when rejected / suspended
    reviewedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("Employer", EmployerSchema);
