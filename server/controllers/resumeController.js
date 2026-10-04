//controller for creating a new resume
//POST: /api/resumes/create

import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from 'fs';

export const createResume = async (req, res)=>
{
    try {
        const userId = req.userId;
        const {title} = req.body;
        //create new resume
        const newResume = await Resume.create({userId,title})
        //return success message
        return res.status(201).json({message:'Resume created successfully', resume:newResume})
        
    } catch (error) {
        return res.status(400).json({message :error.message})
        
    }
}

// controller for deleting a resume
//DELETE: /api/resumes/delete
export const deleteResume = async (req, res)=>
{
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({userId, _id:resumeId})
        //return success message
        return res.status(200).json({message:'Resume deleted successfully'})
        
    } catch (error) {
        return res.status(400).json({message :error.message})
        
    }
}

//get user resumes by user id
//GET: /api/resumes/get
export const getResumesById = async (req, res)=>
{
    try {
        const userId = req.userId;
        const {resumeId} = req.params;
        //return user resumes
        const resume = await Resume.findOne({userId, _id:resumeId})
        
        if(!resume){
            return res.status(404).json({message:'Resume not found'})
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;
        return res.status(200).json({resume})
        
    } catch (error) {
        return res.status(400).json({message :error.message})
        
    }
}

//get resume by id public
//GET: /api/resumes/public

export const getResumePublicById = async (req, res)=>{
    try {
        const {resumeId} = req.params;
        //return user resumes
        // increment the view counter atomically so simultaneous requests don't clobber each other
        const resume = await Resume.findOneAndUpdate(
            {public: true, _id:resumeId},
            {$inc: {views: 1}},
            {new: true}
        );
        if(!resume){
            return res.status(404).json({message:'Resume not found'})
        }
        // resume.__v = undefined;
        // resume.createdAt = undefined;
        // resume.updatedAt = undefined;
        return res.status(200).json({resume})

    } catch (error) {
        return res.status(400).json({message :error.message})

    }
}

// controller for duplicating a resume - lets users keep a base resume and tailor
// copies per job application without losing the original.
//POST: /api/resumes/duplicate/:resumeId
export const duplicateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const original = await Resume.findOne({ userId, _id: resumeId }).lean();
        if (!original) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // strip fields that must be unique/fresh on the copy
        const { _id, createdAt, updatedAt, __v, views, ...resumeData } = original;

        const duplicate = await Resume.create({
            ...resumeData,
            userId,
            title: `${original.title || 'Untitled Resume'} (Copy)`,
            public: false,
            views: 0,
        });

        return res.status(201).json({ message: 'Resume duplicated successfully', resume: duplicate });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for updating a resume
//PUT: /api/resumes/update
export const updateResume = async (req, res)=>
{
    try {
        const userId = req.userId;
        const {resumeId, resumeData, removeBackground} = req.body;
        const image = req.file;
        //find resume by id and update
        let resumeDataCopy ;
        if(typeof resumeData === 'string'){
            resumeDataCopy = await JSON.parse(resumeData);
        }else{
            resumeDataCopy = structuredClone(resumeData);
        }
        if(image){
            const imageBufferData = fs.createReadStream(image.path)
          const response = await imagekit.files.upload({
            file: imageBufferData,
            fileName: 'resume.png',
            folder:'user-resumes',
            transformation:{
                pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground? ',e-bgremove':'')
            }
            });
            resumeDataCopy.personal_info.image = response.url;
        }
        const resume = await Resume.findByIdAndUpdate({userId, _id:resumeId}, resumeDataCopy, {new:true})
        //return success message
        return res.status(200).json({message:'Resume updated successfully', resume})
    } catch (error) {
        return res.status(400).json({message :error.message})
        
    }
}



