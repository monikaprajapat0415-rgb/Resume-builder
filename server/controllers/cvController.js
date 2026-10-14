import Cv from "../models/Cv.js";

// Fields the client is allowed to write. userId, generations and generated are server-controlled.
const EDITABLE = ['title', 'template', 'accent_color', 'target', 'personal_info', 'input', 'cv'];
const pick = (body) => Object.fromEntries(EDITABLE.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

// POST /api/cvs/create
export const createCv = async (req, res) => {
    try {
        const title = String(req.body.title || '').trim().slice(0, 120) || 'Untitled CV';
        const count = await Cv.countDocuments({ userId: req.userId });
        if (count >= 30) return res.status(400).json({ message: 'You have reached the limit of 30 CVs. Delete one to create another.' });
        const cv = await Cv.create({ userId: req.userId, title });
        return res.status(201).json({ message: 'CV created successfully', cv });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// GET /api/cvs  - light list for the dashboard
export const listCvs = async (req, res) => {
    try {
        const cvs = await Cv.find({ userId: req.userId })
            .select('title template generated target.job_title updatedAt createdAt')
            .sort({ updatedAt: -1 })
            .lean();
        return res.status(200).json({ cvs });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// GET /api/cvs/get/:cvId
export const getCv = async (req, res) => {
    try {
        const cv = await Cv.findOne({ userId: req.userId, _id: req.params.cvId }).select('-__v');
        if (!cv) return res.status(404).json({ message: 'CV not found' });
        return res.status(200).json({ cv });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// PUT /api/cvs/update   body: { cvId, ...fields }
export const updateCv = async (req, res) => {
    try {
        const { cvId } = req.body;
        const update = pick(req.body);
        if (update.title !== undefined) update.title = String(update.title).trim().slice(0, 120) || 'Untitled CV';
        // keep the job description a sane size (it is sent to the AI)
        if (update.target?.job_description) update.target.job_description = String(update.target.job_description).slice(0, 8000);
        const cv = await Cv.findOneAndUpdate({ userId: req.userId, _id: cvId }, { $set: update }, { returnDocument: 'after', runValidators: true });
        if (!cv) return res.status(404).json({ message: 'CV not found' });
        return res.status(200).json({ message: 'CV updated successfully', cv });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// POST /api/cvs/duplicate/:cvId
export const duplicateCv = async (req, res) => {
    try {
        const original = await Cv.findOne({ userId: req.userId, _id: req.params.cvId }).lean();
        if (!original) return res.status(404).json({ message: 'CV not found' });
        const { _id, createdAt, updatedAt, __v, generations, ...data } = original;
        const cv = await Cv.create({ ...data, userId: req.userId, title: `${original.title || 'Untitled CV'} (Copy)`, generations: 0 });
        return res.status(201).json({ message: 'CV duplicated successfully', cv });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// DELETE /api/cvs/delete/:cvId
export const deleteCv = async (req, res) => {
    try {
        await Cv.findOneAndDelete({ userId: req.userId, _id: req.params.cvId });
        return res.status(200).json({ message: 'CV deleted successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
