import mongoose from "mongoose";

// A CV is a separate document from a Resume: the user supplies raw details + a target job,
// the AI writes the tailored CV, and the user can still edit every field of the result.
const str = { type: String, default: '' };
const strList = [{ type: String }];

const CvSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    title: { type: String, default: "Untitled CV" },
    template: { type: String, default: "standard" },
    accent_color: { type: String, default: "#1E3A8A" },
    // how many times the AI has been run on this CV (capped in the controller)
    generations: { type: Number, default: 0 },

    // ---- what the user typed in (the only facts the AI may use) ----
    target: {
        job_title: str,
        company: str,
        industry: str,
        level: { type: String, default: 'fresher' }, // fresher | experienced
        job_description: str,
    },
    personal_info: {
        full_name: str, email: str, phone: str, location: str, linkedin: str, website: str,
    },
    input: {
        summary_notes: str,
        skills: strList,
        experience: [{ job_title: str, company: str, location: str, start_date: str, end_date: str, is_current: Boolean, details: str }],
        internships: [{ job_title: str, company: str, location: str, start_date: str, end_date: str, details: str }],
        projects: [{ name: str, technologies: str, details: str }],
        education: [{ qualification: str, institution: str, graduation_year: str, details: str }],
        certifications: strList,
        achievements: strList,
        languages: strList,
        additional_information: strList,
    },

    // ---- what the AI produced (editable by the user) ----
    generated: { type: Boolean, default: false },
    cv: {
        cv_title: str,
        professional_summary: str,
        skills: strList,
        experience: [{ job_title: str, company: str, location: str, start_date: str, end_date: str, responsibilities: strList }],
        projects: [{ project_name: str, description: str, technologies: strList, achievements: strList }],
        education: [{ qualification: str, institution: str, graduation_year: str }],
        certifications: strList,
        internships: [{ job_title: str, company: str, location: str, start_date: str, end_date: str, responsibilities: strList }],
        achievements: strList,
        languages: strList,
        additional_information: strList,
        missing_information: strList,
        ats_recommendations: strList,
    },
}, { timestamps: true, minimize: false });

export default mongoose.model('Cv', CvSchema);
